import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: { type: String },
    idProof: { type: String },
    notes: { type: String },
    course: { type: String },
  },
  { timestamps: true },
);

export const User = models.User || model("User", userSchema);
