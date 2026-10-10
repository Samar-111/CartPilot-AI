import mongoose, { Document, Schema } from "mongoose";

export interface IAgentEventDocument extends Document {
  sessionId: mongoose.Types.ObjectId;
  node: string;
  status: "started" | "in_progress" | "completed" | "failed" | "retrying";
  message: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AgentEventSchema = new Schema<IAgentEventDocument>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "ShoppingSession", required: true, index: true },
    node: { type: String, required: true },
    status: {
      type: String,
      enum: ["started", "in_progress", "completed", "failed", "retrying"],
      required: true
    },
    message: { type: String, required: true },
    durationMs: { type: Number },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AgentEventModel = mongoose.model<IAgentEventDocument>("AgentEvent", AgentEventSchema);
