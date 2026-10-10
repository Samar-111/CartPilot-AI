import mongoose, { Document, Schema } from "mongoose";
import { DietaryPreference } from "@cartpilot/shared";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  dietaryPreferences: DietaryPreference[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    dietaryPreferences: [{ type: String, default: [] }]
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
