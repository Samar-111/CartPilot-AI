import mongoose, { Document, Schema } from "mongoose";
import { ProposedCartItem, ShoppingPlan, ShoppingSessionStatus, DietaryPreference } from "@cartpilot/shared";

export interface IShoppingSessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  request: string;
  budgetPaise: number;
  preferences: DietaryPreference[];
  durationDays: number;
  peopleCount: number;
  status: ShoppingSessionStatus;
  plan?: ShoppingPlan;
  proposedItems: ProposedCartItem[];
  totalPaise: number;
  retryCount: number;
  proposalVersion: number;
  validationMessage?: string;
  pincode?: string;
  cityName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProposedItemSubschema = new Schema<ProposedCartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    unitPricePaise: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotalPaise: { type: Number, required: true },
    reason: { type: String, required: true }
  },
  { _id: false }
);

const ShoppingSessionSchema = new Schema<IShoppingSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    request: { type: String, required: true },
    budgetPaise: { type: Number, required: true },
    preferences: [{ type: String }],
    durationDays: { type: Number, default: 7 },
    peopleCount: { type: Number, default: 2 },
    pincode: { type: String, default: "560001" },
    cityName: { type: String, default: "Bengaluru" },
    status: {
      type: String,
      enum: ["initializing", "planning", "searching", "optimizing", "awaiting_approval", "approved", "rejected", "failed"],
      default: "initializing",
      index: true
    },
    plan: { type: Schema.Types.Mixed },
    proposedItems: [ProposedItemSubschema],
    totalPaise: { type: Number, default: 0 },
    retryCount: { type: Number, default: 0 },
    proposalVersion: { type: Number, default: 1 },
    validationMessage: { type: String }
  },
  { timestamps: true }
);

export const ShoppingSessionModel = mongoose.model<IShoppingSessionDocument>("ShoppingSession", ShoppingSessionSchema);
