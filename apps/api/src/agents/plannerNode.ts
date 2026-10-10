import { ShoppingAgentStateType } from "./state";
import { generateStructuredOutput } from "./llm";
import { ShoppingPlan, ShoppingPlanSchema, ProductCategory } from "@cartpilot/shared";
import { logAgentEvent } from "../services/eventLogger";

export async function createPlanNode(state: ShoppingAgentStateType): Promise<Partial<ShoppingAgentStateType>> {
  const startTime = Date.now();
  await logAgentEvent(state.sessionId, "create_plan", "started", "Agent 1: Analyzing shopping request and dietary constraints...");

  const prompt = `
You are a Shopping Planner AI Agent.
User Request: "${state.userRequest}"
Budget in Paise: ${state.budgetPaise} (₹${state.budgetPaise / 100})
People: ${state.peopleCount}
Duration: ${state.durationDays} days
Preferences: ${JSON.stringify(state.preferences)}

Create a balanced shopping plan with required categories (fruits, vegetables, dairy, grains, protein, bakery, beverages, snacks, staples) and estimated item counts + budget allocations.
Ensure the sum of budgetSharePaise across categories does not exceed ${state.budgetPaise}.
`;

  const schemaDesc = `
{
  "peopleCount": number,
  "durationDays": number,
  "targetBudgetPaise": number,
  "preferences": string[],
  "categories": [
    { "category": "fruits" | "vegetables" | "dairy" | "grains" | "protein" | "bakery" | "beverages" | "snacks" | "staples", "targetItemCount": number, "budgetSharePaise": number, "notes": string }
  ],
  "rationale": string
}
`;

  const fallback = (): ShoppingPlan => {
    const isHealthy = state.preferences.includes("healthy") || state.userRequest.toLowerCase().includes("healthy");
    const budget = state.budgetPaise;
    return {
      peopleCount: state.peopleCount || 2,
      durationDays: state.durationDays || 7,
      targetBudgetPaise: budget,
      preferences: state.preferences,
      categories: [
        { category: "vegetables", targetItemCount: 3, budgetSharePaise: Math.round(budget * 0.25), notes: "Fresh veggies for fiber" },
        { category: "fruits", targetItemCount: 2, budgetSharePaise: Math.round(budget * 0.20), notes: "Seasonal fresh fruits" },
        { category: "grains", targetItemCount: 2, budgetSharePaise: Math.round(budget * 0.20), notes: "Wholesome whole grains" },
        { category: "protein", targetItemCount: 2, budgetSharePaise: Math.round(budget * 0.20), notes: "Paneer, tofu, lentils, or eggs" },
        { category: "dairy", targetItemCount: 1, budgetSharePaise: Math.round(budget * 0.15), notes: "Milk or yogurt" }
      ],
      rationale: `Curated a ${state.durationDays || 7}-day ${isHealthy ? "wholesome & healthy " : ""}grocery plan for ${state.peopleCount || 2} persons within ₹${budget / 100}.`
    };
  };

  const planRaw = await generateStructuredOutput<ShoppingPlan>(prompt, schemaDesc, fallback);
  const plan = ShoppingPlanSchema.parse(planRaw);

  const durationMs = Date.now() - startTime;
  await logAgentEvent(
    state.sessionId,
    "create_plan",
    "completed",
    `Shopping plan formulated: ${plan.categories.length} categories targeted. Rationale: ${plan.rationale}`,
    durationMs
  );

  return {
    plan,
    status: "planning",
    messages: [`Plan generated with ${plan.categories.length} item categories.`]
  };
}
