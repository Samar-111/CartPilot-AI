import { ProposedCartItem, ShoppingPlan } from "@cartpilot/shared";
import { checkInventory } from "../tools/catalogTools";

export interface BudgetValidationResult {
  isValid: boolean;
  totalPaise: number;
  budgetPaise: number;
  differencePaise: number;
  outOfStockItems: string[];
  reasons: string[];
}

export async function validateProposedCart(
  proposedItems: ProposedCartItem[],
  budgetPaise: number,
  plan?: ShoppingPlan
): Promise<BudgetValidationResult> {
  const reasons: string[] = [];
  const outOfStockItems: string[] = [];

  let totalPaise = 0;

  for (const item of proposedItems) {
    const calculatedSubtotal = item.unitPricePaise * item.quantity;
    totalPaise += calculatedSubtotal;

    const inventory = await checkInventory(item.productId, item.quantity);
    if (!inventory.available) {
      outOfStockItems.push(item.name);
      reasons.push(`${item.name} does not have sufficient stock (available: ${inventory.currentStock}).`);
    }
  }

  const differencePaise = totalPaise - budgetPaise;

  if (totalPaise > budgetPaise) {
    reasons.push(
      `Cart total of ₹${(totalPaise / 100).toFixed(2)} exceeds budget of ₹${(budgetPaise / 100).toFixed(2)} by ₹${(differencePaise / 100).toFixed(2)}.`
    );
  }

  if (proposedItems.length === 0) {
    reasons.push("Proposed cart has no items.");
  }

  const isValid = reasons.length === 0;

  return {
    isValid,
    totalPaise,
    budgetPaise,
    differencePaise,
    outOfStockItems,
    reasons
  };
}
