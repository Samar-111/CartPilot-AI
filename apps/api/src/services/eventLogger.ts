import mongoose from "mongoose";
import { AgentEventModel } from "../models";
import { sseManager } from "./sse";

export async function logAgentEvent(
  sessionId: string,
  node: string,
  status: "started" | "in_progress" | "completed" | "failed" | "retrying",
  message: string,
  durationMs?: number,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const event = await AgentEventModel.create({
      sessionId: new mongoose.Types.ObjectId(sessionId),
      node,
      status,
      message,
      durationMs,
      metadata
    });

    sseManager.broadcast(sessionId, "agent_event", {
      id: event._id.toString(),
      sessionId,
      node,
      status,
      message,
      durationMs,
      metadata,
      createdAt: event.createdAt
    });
  } catch (error) {
    console.error("Failed to log agent event:", error);
  }
}
