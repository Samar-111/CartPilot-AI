import { Router, Response } from "express";
import mongoose from "mongoose";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import { ShoppingSessionModel, AgentEventModel } from "../models";
import { runShoppingWorkflow } from "../agents/graph";
import { applyApprovedCart, createSimulatedOrder } from "../tools/cartTools";
import { sseManager } from "../services/sse";
import {
  CreateShoppingSessionInputSchema,
  ApprovalInputSchema,
  ReviseInputSchema
} from "@cartpilot/shared";

export const sessionsRouter = Router();

sessionsRouter.use(authMiddleware);

sessionsRouter.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const input = CreateShoppingSessionInputSchema.parse(req.body);

    const session = await ShoppingSessionModel.create({
      userId: new mongoose.Types.ObjectId(req.userId!),
      request: input.request,
      budgetPaise: input.budgetPaise,
      preferences: input.preferences || [],
      peopleCount: input.peopleCount,
      durationDays: input.durationDays,
      pincode: input.pincode || "560001",
      cityName: input.cityName || "Bengaluru",
      status: "initializing",
      proposedItems: [],
      totalPaise: 0,
      retryCount: 0,
      proposalVersion: 1
    });

    res.status(201).json({
      sessionId: session._id.toString(),
      status: session.status,
      message: "Shopping session initialized. Starting LangGraph workflow."
    });

    runShoppingWorkflow({
      userId: req.userId!,
      sessionId: session._id.toString(),
      userRequest: input.request,
      budgetPaise: input.budgetPaise,
      preferences: input.preferences || [],
      peopleCount: input.peopleCount,
      durationDays: input.durationDays,
      pincode: session.pincode,
      cityName: session.cityName,
      retryCount: 0,
      messages: []
    }).catch(err => {
      console.error(`Workflow execution error for session ${session._id}:`, err);
      ShoppingSessionModel.findByIdAndUpdate(session._id, { status: "failed" }).exec();
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to create shopping session" });
  }
});

sessionsRouter.get("/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const session = await ShoppingSessionModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      userId: new mongoose.Types.ObjectId(req.userId!)
    }).lean();

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json({
      id: (session as any)._id.toString(),
      userId: session.userId.toString(),
      request: session.request,
      budgetPaise: session.budgetPaise,
      preferences: session.preferences,
      durationDays: session.durationDays,
      peopleCount: session.peopleCount,
      pincode: (session as any).pincode || "560001",
      cityName: (session as any).cityName || "Bengaluru",
      status: session.status,
      plan: session.plan,
      proposedItems: session.proposedItems,
      totalPaise: session.totalPaise,
      retryCount: session.retryCount,
      proposalVersion: session.proposalVersion,
      validationMessage: session.validationMessage,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve session" });
  }
});

sessionsRouter.get("/:id/events", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const session = await ShoppingSessionModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(req.userId!)
    });

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const previousEvents = await AgentEventModel.find({
      sessionId: new mongoose.Types.ObjectId(id)
    }).sort({ createdAt: 1 }).lean();

    for (const event of previousEvents) {
      res.write(`event: agent_event\ndata: ${JSON.stringify({
        id: (event as any)._id.toString(),
        sessionId: id,
        node: event.node,
        status: event.status,
        message: event.message,
        durationMs: event.durationMs,
        createdAt: event.createdAt
      })}\n\n`);
    }

    sseManager.addClient(id, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to initiate SSE stream" });
  }
});

sessionsRouter.post("/:id/approval", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { approved, proposalVersion, feedback } = ApprovalInputSchema.parse(req.body);
    const session = await ShoppingSessionModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      userId: new mongoose.Types.ObjectId(req.userId!)
    });

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    if (session.proposalVersion !== proposalVersion) {
      res.status(409).json({
        error: `Proposal version mismatch. Approved version: ${proposalVersion}, Current session version: ${session.proposalVersion}`
      });
      return;
    }

    if (approved) {
      session.status = "approved";
      await session.save();

      await applyApprovedCart(req.userId!, session.proposedItems);

      res.json({
        message: "Proposal approved! Items successfully added to cart.",
        sessionId: session._id.toString(),
        status: session.status
      });
    } else {
      session.status = "rejected";
      session.validationMessage = feedback || "Proposal rejected by user.";
      await session.save();

      res.json({
        message: "Proposal rejected.",
        sessionId: session._id.toString(),
        status: session.status
      });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Approval checkpoint failed" });
  }
});

sessionsRouter.post("/:id/revise", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { modification, adjustedBudgetPaise } = ReviseInputSchema.parse(req.body);
    const session = await ShoppingSessionModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      userId: new mongoose.Types.ObjectId(req.userId!)
    });

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    session.request = `${session.request} | User update: ${modification}`;
    if (adjustedBudgetPaise) {
      session.budgetPaise = adjustedBudgetPaise;
    }
    session.proposalVersion += 1;
    session.status = "planning";
    session.retryCount = 0;
    await session.save();

    res.json({
      message: "Session revised and restarted.",
      sessionId: session._id.toString(),
      proposalVersion: session.proposalVersion
    });

    runShoppingWorkflow({
      userId: req.userId!,
      sessionId: session._id.toString(),
      userRequest: session.request,
      budgetPaise: session.budgetPaise,
      preferences: session.preferences,
      peopleCount: session.peopleCount,
      durationDays: session.durationDays,
      pincode: session.pincode,
      cityName: session.cityName,
      retryCount: 0,
      messages: []
    }).catch(err => {
      console.error(`Workflow revision error for session ${session._id}:`, err);
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to revise session" });
  }
});

sessionsRouter.post("/:id/checkout", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = await createSimulatedOrder(req.userId!, req.params.id);
    res.status(201).json({
      message: "Order placed successfully!",
      orderId: (order as any)._id.toString(),
      totalPaise: order.totalPaise,
      itemCount: order.items.length,
      status: order.status
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to checkout" });
  }
});
