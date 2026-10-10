import mongoose from "mongoose";
import { CartModel, OrderModel, ICartDocument, IOrderDocument } from "../models";
import { ProposedCartItem } from "@cartpilot/shared";
import { calculateCartTotal } from "./catalogTools";

export async function getUserCart(userId: string): Promise<ICartDocument> {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  let cart = await CartModel.findOne({ userId: userObjectId, status: "active" });
  if (!cart) {
    cart = await CartModel.create({
      userId: userObjectId,
      items: [],
      status: "active"
    });
  }
  return cart;
}

export async function applyApprovedCart(
  userId: string,
  proposedItems: ProposedCartItem[]
): Promise<ICartDocument> {
  const { verifiedItems } = await calculateCartTotal(
    proposedItems.map(p => ({ productId: p.productId, quantity: p.quantity }))
  );

  const cart = await getUserCart(userId);
  cart.items = verifiedItems.map(item => ({
    productId: new mongoose.Types.ObjectId(item.productId),
    quantity: item.quantity,
    unitPricePaise: item.unitPricePaise
  })) as any;

  await cart.save();
  return cart;
}

export async function createSimulatedOrder(
  userId: string,
  sessionId?: string
): Promise<IOrderDocument> {
  const cart = await getUserCart(userId);
  if (cart.items.length === 0) {
    throw new Error("Cannot checkout empty cart");
  }

  const { verifiedItems, totalPaise } = await calculateCartTotal(
    cart.items.map(item => ({ productId: item.productId.toString(), quantity: item.quantity }))
  );

  const order = await OrderModel.create({
    userId: new mongoose.Types.ObjectId(userId),
    sessionId: sessionId ? new mongoose.Types.ObjectId(sessionId) : undefined,
    items: verifiedItems.map(i => ({
      productId: new mongoose.Types.ObjectId(i.productId),
      name: i.name,
      unit: i.unit,
      unitPricePaise: i.unitPricePaise,
      quantity: i.quantity,
      subtotalPaise: i.subtotalPaise
    })),
    totalPaise,
    status: "confirmed"
  });

  cart.items = [];
  await cart.save();

  return order;
}
