import { Router, Response } from "express";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import { createCheckoutOrder, verifyPaymentSignature } from "../services/paymentService";
import { OrderModel } from "../models";
import { DeliveryAddressSchema } from "@cartpilot/shared";
import { z } from "zod";
import mongoose from "mongoose";

export const checkoutRouter = Router();

checkoutRouter.use(authMiddleware);

const CreateOrderInputSchema = z.object({
  deliveryAddress: DeliveryAddressSchema,
  sessionId: z.string().optional()
});

checkoutRouter.post("/create-order", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { deliveryAddress, sessionId } = CreateOrderInputSchema.parse(req.body);

    const result = await createCheckoutOrder(req.userId!, deliveryAddress, sessionId);

    res.status(201).json({
      orderId: (result.order as any)._id.toString(),
      razorpayOrderId: result.razorpayOrderId,
      keyId: result.keyId,
      amountPaise: result.amountPaise,
      currency: "INR",
      deliveryAddress: result.order.deliveryAddress
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to initialize checkout order" });
  }
});

const VerifyPaymentInputSchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string()
});

checkoutRouter.post("/verify-payment", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = VerifyPaymentInputSchema.parse(req.body);

    const order = await verifyPaymentSignature(
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    res.json({
      message: "Payment successfully verified and order confirmed!",
      orderId: (order as any)._id.toString(),
      status: order.status,
      paymentStatus: order.paymentStatus
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Payment verification failed" });
  }
});

checkoutRouter.get("/orders", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await OrderModel.find({
      userId: new mongoose.Types.ObjectId(req.userId!)
    }).sort({ createdAt: -1 }).lean();

    res.json({
      orders: orders.map(o => ({
        id: (o as any)._id.toString(),
        totalPaise: o.totalPaise,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        itemCount: o.items.length,
        items: o.items,
        deliveryAddress: o.deliveryAddress,
        createdAt: o.createdAt
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
});

checkoutRouter.get("/orders/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = await OrderModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      userId: new mongoose.Types.ObjectId(req.userId!)
    }).lean();

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({
      id: (order as any)._id.toString(),
      totalPaise: order.totalPaise,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      items: order.items,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch order" });
  }
});
