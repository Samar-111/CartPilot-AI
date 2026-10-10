import { ShoppingAgentStateType } from "./state";
import { searchProducts } from "../tools/catalogTools";
import { IProductDocument } from "../models";
import { logAgentEvent } from "../services/eventLogger";

export async function searchProductsNode(state: ShoppingAgentStateType): Promise<Partial<ShoppingAgentStateType>> {
  const startTime = Date.now();
  await logAgentEvent(state.sessionId, "search_products", "started", "Agent 2: Querying MongoDB product catalog for verified candidates...");

  const plan = state.plan;
  const categoriesToSearch = plan?.categories?.map(c => c.category) || ["fruits", "vegetables", "grains", "dairy", "protein"];
  const candidateProducts: IProductDocument[] = [];

  const isHealthy = state.preferences.includes("healthy") || state.userRequest.toLowerCase().includes("healthy");

  for (const cat of categoriesToSearch) {
    const results = await searchProducts({
      category: cat,
      isHealthy: isHealthy ? true : undefined,
      limit: 10
    });

    if (results.length === 0) {
      const fallbackResults = await searchProducts({ category: cat, limit: 10 });
      candidateProducts.push(...fallbackResults);
    } else {
      candidateProducts.push(...results);
    }
  }

  const durationMs = Date.now() - startTime;
  await logAgentEvent(
    state.sessionId,
    "search_products",
    "completed",
    `Found ${candidateProducts.length} verified candidate products from inventory.`,
    durationMs
  );

  return {
    candidateProducts,
    status: "searching",
    messages: [`Retrieved ${candidateProducts.length} in-stock product candidates.`]
  };
}
