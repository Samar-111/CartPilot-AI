import { StateGraph, START, END } from "@langchain/langgraph";
import { ShoppingAgentState, ShoppingAgentStateType } from "./state";
import { createPlanNode } from "./plannerNode";
import { searchProductsNode } from "./researchNode";
import { rankAndSelectNode } from "./recommendationNode";
import { buildProposedCartNode } from "./cartManagerNode";
import { validateCartNode } from "./validatorNode";
import { revisePlanNode } from "./replannerNode";
import { ShoppingSessionModel } from "../models";
import { logAgentEvent } from "../services/eventLogger";

function shouldContinueAfterValidation(state: ShoppingAgentStateType): "await_approval" | "revise_plan" | typeof END {
  if (state.isValid) {
    return "await_approval";
  }

  if (state.retryCount < 3) {
    return "revise_plan";
  }

  return "await_approval";
}

async function awaitApprovalNode(state: ShoppingAgentStateType): Promise<Partial<ShoppingAgentStateType>> {
  await logAgentEvent(
    state.sessionId,
    "await_approval",
    "completed",
    `Proposed cart ready for user confirmation. ${state.proposedItems.length} items, total ₹${state.totalPaise / 100}.`
  );

  await ShoppingSessionModel.findByIdAndUpdate(state.sessionId, {
    status: "awaiting_approval",
    plan: state.plan,
    proposedItems: state.proposedItems,
    totalPaise: state.totalPaise,
    retryCount: state.retryCount,
    validationMessage: state.isValid
      ? "Budget & inventory validated successfully."
      : `Warning: ${state.validationReasons.join(", ")}`
  });

  return {
    status: "awaiting_approval"
  };
}

export function buildShoppingWorkflow() {
  const workflow = new StateGraph(ShoppingAgentState)
    .addNode("create_plan", createPlanNode)
    .addNode("search_products", searchProductsNode)
    .addNode("rank_products", rankAndSelectNode)
    .addNode("build_proposed_cart", buildProposedCartNode)
    .addNode("validate_cart", validateCartNode)
    .addNode("revise_plan", revisePlanNode)
    .addNode("await_approval", awaitApprovalNode)
    .addEdge(START, "create_plan")
    .addEdge("create_plan", "search_products")
    .addEdge("search_products", "rank_products")
    .addEdge("rank_products", "build_proposed_cart")
    .addEdge("build_proposed_cart", "validate_cart")
    .addConditionalEdges("validate_cart", shouldContinueAfterValidation, {
      await_approval: "await_approval",
      revise_plan: "revise_plan",
      [END]: END
    })
    .addEdge("revise_plan", "validate_cart")
    .addEdge("await_approval", END);

  return workflow.compile();
}

export const shoppingWorkflow = buildShoppingWorkflow();

export async function runShoppingWorkflow(initialState: Partial<ShoppingAgentStateType>): Promise<ShoppingAgentStateType> {
  const result = await shoppingWorkflow.invoke(initialState as any);
  return result as ShoppingAgentStateType;
}
