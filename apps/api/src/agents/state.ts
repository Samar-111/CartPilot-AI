import { Annotation } from "@langchain/langgraph";
import { ProposedCartItem, ShoppingPlan, DietaryPreference } from "@cartpilot/shared";
import { IProductDocument } from "../models";

export const ShoppingAgentState = Annotation.Root({
  userId: Annotation<string>(),
  sessionId: Annotation<string>(),
  userRequest: Annotation<string>(),
  budgetPaise: Annotation<number>(),
  preferences: Annotation<DietaryPreference[]>(),
  peopleCount: Annotation<number>(),
  durationDays: Annotation<number>(),

  plan: Annotation<ShoppingPlan | undefined>(),
  candidateProducts: Annotation<IProductDocument[]>({
    reducer: (curr, update) => update ?? curr,
    default: () => []
  }),
  proposedItems: Annotation<ProposedCartItem[]>({
    reducer: (curr, update) => update ?? curr,
    default: () => []
  }),

  totalPaise: Annotation<number>(),
  isValid: Annotation<boolean>(),
  retryCount: Annotation<number>({
    reducer: (curr, update) => update ?? curr,
    default: () => 0
  }),
  validationReasons: Annotation<string[]>({
    reducer: (curr, update) => update ?? curr,
    default: () => []
  }),

  status: Annotation<string>(),
  messages: Annotation<string[]>({
    reducer: (curr, update) => curr.concat(update),
    default: () => []
  })
});

export type ShoppingAgentStateType = typeof ShoppingAgentState.State;
