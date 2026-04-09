import { Schema, model, models } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card"],
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

export const Payment = models.Payment || model("Payment", paymentSchema);
