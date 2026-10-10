import { ShoppingAgentStateType } from "./state";
import { validateProposedCart } from "../services/budgetValidator";
import { logAgentEvent } from "../services/eventLogger";

export async function validateCartNode(state: ShoppingAgentStateType): Promise<Partial<ShoppingAgentStateType>> {
  const startTime = Date.now();
  await logAgentEvent(state.sessionId, "validate_cart", "started", "Agent 5: Running deterministic budget and inventory validation checks...");

  const result = await validateProposedCart(state.proposedItems, state.budgetPaise, state.plan);

  const durationMs = Date.now() - startTime;
  if (result.isValid) {
    await logAgentEvent(
      state.sessionId,
      "validate_cart",
      "completed",
      `Validation passed! Total ₹${result.totalPaise / 100} is within budget ₹${result.budgetPaise / 100}.`,
      durationMs
    );
  } else {
    await logAgentEvent(
      state.sessionId,
      "validate_cart",
      "failed",
      `Validation issues detected: ${result.reasons.join(" | ")}. Retry attempt: ${state.retryCount + 1}`,
      durationMs
    );
  }

  return {
    isValid: result.isValid,
    totalPaise: result.totalPaise,
    validationReasons: result.reasons,
    status: result.isValid ? "awaiting_approval" : "planning"
  };
}
