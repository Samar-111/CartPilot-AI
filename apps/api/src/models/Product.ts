import mongoose, { Document, Schema } from "mongoose";
import { ProductCategory } from "@cartpilot/shared";

export interface IProductDocument extends Document {
  name: string;
  category: ProductCategory;
  pricePaise: number;
  unit: string;
  stock: number;
  tags: string[];
  isHealthy: boolean;
  isActive: boolean;
  image?: string;
  storeName?: string;
  pincode?: string;
  lastPriceSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, index: true },
    pricePaise: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    tags: [{ type: String, index: true }],
    isHealthy: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    image: { type: String },
    storeName: { type: String, default: "Bengaluru Central DarkStore", index: true },
    pincode: { type: String, default: "560001", index: true },
    lastPriceSyncAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", tags: "text" });

export const ProductModel = mongoose.model<IProductDocument>("Product", ProductSchema);
