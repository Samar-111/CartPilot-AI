import mongoose from "mongoose";
import { ProductModel, IProductDocument } from "../models";
import { ProductSearchInput, ProductSearchInputSchema } from "@cartpilot/shared";

export async function searchProducts(input: ProductSearchInput): Promise<IProductDocument[]> {
  const parsed = ProductSearchInputSchema.parse(input);
  const filter: Record<string, unknown> = { isActive: true };

  if (parsed.category) {
    filter.category = parsed.category;
  }

  if (parsed.maxPricePaise) {
    filter.pricePaise = { $lte: parsed.maxPricePaise };
  }

  if (parsed.isHealthy !== undefined) {
    filter.isHealthy = parsed.isHealthy;
  }

  if (parsed.tags && parsed.tags.length > 0) {
    filter.tags = { $in: parsed.tags };
  }

  if (parsed.query && parsed.query.trim().length > 0) {
    const regex = new RegExp(parsed.query.trim(), "i");
    filter.$or = [{ name: regex }, { tags: regex }];
  }

  const limit = Math.min(parsed.limit || 20, 50);

  return ProductModel.find(filter)
    .sort({ isHealthy: -1, pricePaise: 1 })
    .limit(limit)
    .lean() as unknown as Promise<IProductDocument[]>;
}

export async function getProductDetails(productId: string): Promise<IProductDocument | null> {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return null;
  }
  return ProductModel.findById(productId).lean() as unknown as Promise<IProductDocument | null>;
}

export async function checkInventory(
  productId: string,
  requestedQuantity: number
): Promise<{ available: boolean; currentStock: number; unitPricePaise: number; name: string }> {
  const product = await getProductDetails(productId);
  if (!product || !product.isActive) {
    return { available: false, currentStock: 0, unitPricePaise: 0, name: "" };
  }
  return {
    available: product.stock >= requestedQuantity,
    currentStock: product.stock,
    unitPricePaise: product.pricePaise,
    name: product.name
  };
}

export async function calculateCartTotal(
  items: Array<{ productId: string; quantity: number }>
): Promise<{
  verifiedItems: Array<{
    productId: string;
    name: string;
    unit: string;
    unitPricePaise: number;
    quantity: number;
    subtotalPaise: number;
    inStock: boolean;
  }>;
  totalPaise: number;
}> {
  const verifiedItems: Array<{
    productId: string;
    name: string;
    unit: string;
    unitPricePaise: number;
    quantity: number;
    subtotalPaise: number;
    inStock: boolean;
  }> = [];

  let totalPaise = 0;

  for (const item of items) {
    const product = await getProductDetails(item.productId);
    if (!product || !product.isActive) {
      continue;
    }

    const available = product.stock >= item.quantity;
    const subtotalPaise = product.pricePaise * item.quantity;
    totalPaise += subtotalPaise;

    verifiedItems.push({
      productId: (product as any)._id.toString(),
      name: product.name,
      unit: product.unit,
      unitPricePaise: product.pricePaise,
      quantity: item.quantity,
      subtotalPaise,
      inStock: available
    });
  }

  return { verifiedItems, totalPaise };
}
