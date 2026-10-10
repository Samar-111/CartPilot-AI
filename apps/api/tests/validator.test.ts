import { describe, it, expect, vi } from "vitest";
import { validateProposedCart } from "../src/services/budgetValidator";
import * as catalogTools from "../src/tools/catalogTools";
import { ProposedCartItem } from "@cartpilot/shared";

describe("Budget & Policy Validator deterministic checks", () => {
  it("approves cart within budget and with available inventory", async () => {
    vi.spyOn(catalogTools, "checkInventory").mockResolvedValue({
      available: true,
      currentStock: 10,
      unitPricePaise: 10000,
      name: "Organic Oats"
    });

    const items: ProposedCartItem[] = [
      {
        productId: "p1",
        name: "Organic Oats",
        category: "grains",
        unit: "500g",
        unitPricePaise: 10000,
        quantity: 2,
        subtotalPaise: 20000,
        reason: "Healthy staple"
      }
    ];

    const result = await validateProposedCart(items, 50000);
    expect(result.isValid).toBe(true);
    expect(result.totalPaise).toBe(20000);
    expect(result.reasons).toHaveLength(0);
  });

  it("flags cart when total exceeds budget limit", async () => {
    vi.spyOn(catalogTools, "checkInventory").mockResolvedValue({
      available: true,
      currentStock: 10,
      unitPricePaise: 150000,
      name: "Cold Pressed Olive Oil"
    });

    const items: ProposedCartItem[] = [
      {
        productId: "p2",
        name: "Cold Pressed Olive Oil",
        category: "staples",
        unit: "1L",
        unitPricePaise: 150000,
        quantity: 2,
        subtotalPaise: 300000,
        reason: "Cooking oil"
      }
    ];

    const result = await validateProposedCart(items, 200000);
    expect(result.isValid).toBe(false);
    expect(result.totalPaise).toBe(300000);
    expect(result.differencePaise).toBe(100000);
    expect(result.reasons.some(r => r.includes("exceeds budget"))).toBe(true);
  });

  it("flags cart when requested quantity exceeds stock", async () => {
    vi.spyOn(catalogTools, "checkInventory").mockResolvedValue({
      available: false,
      currentStock: 2,
      unitPricePaise: 10000,
      name: "Brown Rice"
    });

    const items: ProposedCartItem[] = [
      {
        productId: "p3",
        name: "Brown Rice",
        category: "grains",
        unit: "1kg",
        unitPricePaise: 10000,
        quantity: 5,
        subtotalPaise: 50000,
        reason: "Diet staple"
      }
    ];

    const result = await validateProposedCart(items, 100000);
    expect(result.isValid).toBe(false);
    expect(result.outOfStockItems).toContain("Brown Rice");
  });
});
