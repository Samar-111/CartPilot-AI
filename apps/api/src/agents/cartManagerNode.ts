import { ShoppingAgentStateType } from "./state";
import { calculateCartTotal } from "../tools/catalogTools";
import { ProposedCartItem } from "@cartpilot/shared";
import { logAgentEvent } from "../services/eventLogger";

export async function buildProposedCartNode(state: ShoppingAgentStateType): Promise<Partial<ShoppingAgentStateType>> {
  const startTime = Date.now();
  await logAgentEvent(state.sessionId, "build_proposed_cart", "started", "Agent 4: Calculating exact server-side subtotals and line items...");

  const proposed = state.proposedItems;
  const mergedMap = new Map<string, ProposedCartItem>();

  for (const item of proposed) {
    if (mergedMap.has(item.productId)) {
      const existing = mergedMap.get(item.productId)!;
      existing.quantity += item.quantity;
      existing.subtotalPaise = existing.quantity * existing.unitPricePaise;
    } else {
      mergedMap.set(item.productId, { ...item });
    }
  }

  const itemsToVerify = Array.from(mergedMap.values()).map(i => ({
    productId: i.productId,
    quantity: i.quantity
  }));

  const { verifiedItems, totalPaise } = await calculateCartTotal(itemsToVerify);

  const finalProposed: ProposedCartItem[] = [];
  for (const v of verifiedItems) {
    const orig = mergedMap.get(v.productId);
    finalProposed.push({
      productId: v.productId,
      name: v.name,
      category: orig?.category || "staples",
      unit: v.unit,
      unitPricePaise: v.unitPricePaise,
      quantity: v.quantity,
      subtotalPaise: v.subtotalPaise,
      reason: orig?.reason || "Catalog verified grocery item."
    });
  }

  const durationMs = Date.now() - startTime;
  await logAgentEvent(
    state.sessionId,
    "build_proposed_cart",
    "completed",
    `Consolidated ${finalProposed.length} items. Total: ₹${totalPaise / 100}`,
    durationMs
  );

  return {
    proposedItems: finalProposed,
    totalPaise,
    status: "optimizing",
    messages: [`Built proposed cart with total ₹${totalPaise / 100}.`]
  };
}
