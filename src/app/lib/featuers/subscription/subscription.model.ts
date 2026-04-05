import { Schema, model, models } from "mongoose";

const subscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seatId: {
      type: Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    plan: {
      type: String, // "15 days", "1 month"
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

    isRenewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

subscriptionSchema.index({ seatId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

export const Subscription =
  models.Subscription || model("Subscription", subscriptionSchema);
