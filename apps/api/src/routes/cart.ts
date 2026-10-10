import { Router, Response } from "express";
import mongoose from "mongoose";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import { getUserCart } from "../tools/cartTools";
import { calculateCartTotal, getProductDetails } from "../tools/catalogTools";
import { z } from "zod";

export const cartRouter = Router();

cartRouter.use(authMiddleware);

cartRouter.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const cart = await getUserCart(req.userId!);
    const rawItems = cart.items.map(i => ({
      productId: i.productId.toString(),
      quantity: i.quantity
    }));

    const { verifiedItems, totalPaise } = await calculateCartTotal(rawItems);

    res.json({
      id: cart._id.toString(),
      userId: req.userId,
      items: verifiedItems,
      totalPaise,
      status: cart.status,
      updatedAt: cart.updatedAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve cart" });
  }
});

const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0)
});

cartRouter.patch("/items/:productId", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { quantity } = UpdateCartItemSchema.parse(req.body);
    const { productId } = req.params;

    const cart = await getUserCart(req.userId!);
    const prod = await getProductDetails(productId);
    if (!prod) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);

    if (quantity === 0) {
      if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
      }
    } else {
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].unitPricePaise = prod.pricePaise;
      } else {
        cart.items.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity,
          unitPricePaise: prod.pricePaise
        } as any);
      }
    }

    await cart.save();

    const { verifiedItems, totalPaise } = await calculateCartTotal(
      cart.items.map(i => ({ productId: i.productId.toString(), quantity: i.quantity }))
    );

    res.json({
      id: cart._id.toString(),
      items: verifiedItems,
      totalPaise,
      status: cart.status
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to update item" });
  }
});

cartRouter.delete("/items/:productId", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const cart = await getUserCart(req.userId!);
    cart.items = cart.items.filter(i => i.productId.toString() !== productId) as any;
    await cart.save();

    const { verifiedItems, totalPaise } = await calculateCartTotal(
      cart.items.map(i => ({ productId: i.productId.toString(), quantity: i.quantity }))
    );

    res.json({
      id: cart._id.toString(),
      items: verifiedItems,
      totalPaise
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete item" });
  }
});
