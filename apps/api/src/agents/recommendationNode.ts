import { ShoppingAgentStateType } from "./state";
import { generateStructuredOutput } from "./llm";
import { IProductDocument } from "../models";
import { ProposedCartItem } from "@cartpilot/shared";
import { logAgentEvent } from "../services/eventLogger";

export async function rankAndSelectNode(state: ShoppingAgentStateType): Promise<Partial<ShoppingAgentStateType>> {
  const startTime = Date.now();
  await logAgentEvent(state.sessionId, "rank_products", "started", "Agent 3: Ranking candidates against user preferences and alternatives...");

  const candidates = state.candidateProducts;
  const budgetPaise = state.budgetPaise;
  const plan = state.plan;

  const candidateSummary = candidates.map(c => ({
    id: (c as any)._id.toString(),
    name: c.name,
    category: c.category,
    pricePaise: c.pricePaise,
    unit: c.unit,
    isHealthy: c.isHealthy,
    tags: c.tags,
    stock: c.stock
  }));

  const days = state.durationDays || 7;
  const people = state.peopleCount || 2;
  const prompt = `
You are the Recommendation AI Agent.
User Request: "${state.userRequest}"
Budget: ₹${budgetPaise / 100} (${budgetPaise} paise)
Household Size: ${people} people
Duration: ${days} days (${Math.round(days / 7)} weeks)
Dietary Preferences: ${JSON.stringify(state.preferences)}
Target Plan Categories: ${JSON.stringify(plan?.categories)}

Candidate Catalog Products:
${JSON.stringify(candidateSummary.slice(0, 40))}

Select the best set of products and recommended quantities to build a comprehensive grocery cart for ${people} people covering all ${days} days.
Crucial constraints:
- Must only pick product IDs that exist in Candidate Catalog Products above.
- Total sum (quantity * pricePaise) MUST be strictly <= ${budgetPaise} paise.
- Provide a clear reason for each selection.
`;

  const schemaDesc = `
[
  {
    "productId": string,
    "quantity": number,
    "reason": string
  }
]
`;

  const fallback = (): Array<{ productId: string; quantity: number; reason: string }> => {
    const selected: Array<{ productId: string; quantity: number; reason: string }> = [];
    let currentTotal = 0;
    const qtyMultiplier = Math.max(1, Math.min(4, Math.ceil(days / 7)));

    const grouped = new Map<string, IProductDocument[]>();
    for (const prod of candidates) {
      if (!grouped.has(prod.category)) {
        grouped.set(prod.category, []);
      }
      grouped.get(prod.category)!.push(prod);
    }

    for (const [, items] of grouped) {
      const sorted = [...items].sort((a, b) => {
        if (a.isHealthy !== b.isHealthy) return b.isHealthy ? 1 : -1;
        return a.pricePaise - b.pricePaise;
      });

      for (const item of sorted.slice(0, 3)) {
        const id = (item as any)._id.toString();
        const desiredQty = Math.min(item.stock, qtyMultiplier);
        const cost = item.pricePaise * desiredQty;
        if (currentTotal + cost <= budgetPaise && desiredQty >= 1) {
          selected.push({
            productId: id,
            quantity: desiredQty,
            reason: item.isHealthy
              ? `Healthy selection provisioned for ${days} days.`
              : `Grocery staple provisioned for household of ${people}.`
          });
          currentTotal += cost;
        }
      }
    }

    return selected;
  };

  const recommendations = await generateStructuredOutput<Array<{ productId: string; quantity: number; reason: string }>>(
    prompt,
    schemaDesc,
    fallback
  );

  const candidateMap = new Map<string, IProductDocument>();
  for (const c of candidates) {
    candidateMap.set((c as any)._id.toString(), c);
  }

  let proposedItems: ProposedCartItem[] = [];
  for (const rec of recommendations) {
    const prod = candidateMap.get(rec.productId);
    if (prod && prod.isActive && prod.stock > 0) {
      const qty = Math.max(1, Math.min(rec.quantity || 1, prod.stock));
      proposedItems.push({
        productId: (prod as any)._id.toString(),
        name: prod.name,
        category: prod.category,
        unit: prod.unit,
        unitPricePaise: prod.pricePaise,
        quantity: qty,
        subtotalPaise: prod.pricePaise * qty,
        reason: rec.reason || "Recommended based on budget and preference match."
      });
    }
  }

  if (proposedItems.length === 0 && candidates.length > 0) {
    const fallbackRecs = fallback();
    for (const rec of fallbackRecs) {
      const prod = candidateMap.get(rec.productId);
      if (prod && prod.isActive && prod.stock > 0) {
        proposedItems.push({
          productId: (prod as any)._id.toString(),
          name: prod.name,
          category: prod.category,
          unit: prod.unit,
          unitPricePaise: prod.pricePaise,
          quantity: 1,
          subtotalPaise: prod.pricePaise,
          reason: rec.reason
        });
      }
    }
  }

  const durationMs = Date.now() - startTime;
  await logAgentEvent(
    state.sessionId,
    "rank_products",
    "completed",
    `Recommended ${proposedItems.length} curated grocery items.`,
    durationMs
  );

  return {
    proposedItems,
    status: "optimizing",
    messages: [`Selected ${proposedItems.length} candidate items.`]
  };
}
