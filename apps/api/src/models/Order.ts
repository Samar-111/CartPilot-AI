import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItemSubdocument {
  productId: mongoose.Types.ObjectId;
  name: string;
  unit: string;
  unitPricePaise: number;
  quantity: number;
  subtotalPaise: number;
}

export interface IOrderDocument extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  items: IOrderItemSubdocument[];
  totalPaise: number;
  status: "pending_confirmation" | "confirmed" | "dispatched" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSubschema = new Schema<IOrderItemSubdocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    unitPricePaise: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotalPaise: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "ShoppingSession" },
    items: [OrderItemSubschema],
    totalPaise: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending_confirmation", "confirmed", "dispatched", "delivered"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrderDocument>("Order", OrderSchema);
