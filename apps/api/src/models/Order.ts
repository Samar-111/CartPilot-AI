import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItemSubdocument {
  productId: mongoose.Types.ObjectId;
  name: string;
  unit: string;
  unitPricePaise: number;
  quantity: number;
  subtotalPaise: number;
}

export interface IDeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrderDocument extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  items: IOrderItemSubdocument[];
  totalPaise: number;
  status: "pending_payment" | "confirmed" | "dispatched" | "delivered" | "failed";
  paymentMethod: "razorpay" | "simulated" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  deliveryAddress?: IDeliveryAddress;
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

const DeliveryAddressSubschema = new Schema<IDeliveryAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
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
      enum: ["pending_payment", "confirmed", "dispatched", "delivered", "failed"],
      default: "pending_payment"
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "simulated", "cod"],
      default: "razorpay"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    deliveryAddress: DeliveryAddressSubschema
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrderDocument>("Order", OrderSchema);
