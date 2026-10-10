import mongoose, { Document, Schema } from "mongoose";

export interface ICartItemSubdocument {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPricePaise: number;
}

export interface ICartDocument extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItemSubdocument[];
  status: "active" | "converted" | "abandoned";
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSubschema = new Schema<ICartItemSubdocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPricePaise: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const CartSchema = new Schema<ICartDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [CartItemSubschema],
    status: { type: String, enum: ["active", "converted", "abandoned"], default: "active" }
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<ICartDocument>("Cart", CartSchema);
