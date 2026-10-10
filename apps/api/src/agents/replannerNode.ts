import { ShoppingAgentStateType } from "./state";
import { ProposedCartItem } from "@cartpilot/shared";
import { logAgentEvent } from "../services/eventLogger";

export async function revisePlanNode(state: ShoppingAgentStateType): Promise<Partial<ShoppingAgentStateType>> {
  const startTime = Date.now();
  const nextRetry = state.retryCount + 1;
  await logAgentEvent(
    state.sessionId,
    "revise_plan",
    "retrying",
    `Auto-optimizing proposed cart (Attempt ${nextRetry}/3). Adjusting quantities and removing excess high-cost items...`
  );

  let currentItems: ProposedCartItem[] = [...state.proposedItems];

  currentItems.sort((a, b) => b.subtotalPaise - a.subtotalPaise);

  let currentTotal = currentItems.reduce((acc, item) => acc + item.subtotalPaise, 0);

  for (let i = 0; i < currentItems.length && currentTotal > state.budgetPaise; i++) {
    if (currentItems[i].quantity > 1) {
      currentItems[i].quantity -= 1;
      currentItems[i].subtotalPaise = currentItems[i].quantity * currentItems[i].unitPricePaise;
      currentTotal = currentItems.reduce((acc, item) => acc + item.subtotalPaise, 0);
    }
  }

  while (currentTotal > state.budgetPaise && currentItems.length > 2) {
    currentItems.pop();
    currentTotal = currentItems.reduce((acc, item) => acc + item.subtotalPaise, 0);
  }

  const durationMs = Date.now() - startTime;
  await logAgentEvent(
    state.sessionId,
    "revise_plan",
    "completed",
    `Replanned: reduced to ${currentItems.length} items totaling ₹${currentTotal / 100}. Re-verifying...`,
    durationMs
  );

  return {
    proposedItems: currentItems,
    totalPaise: currentTotal,
    retryCount: nextRetry
  };
}
