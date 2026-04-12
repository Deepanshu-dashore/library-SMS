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

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

    cancelledAt: Date,

    transferHistory: {
      type: [
        {
          fromSeat: { type: Schema.Types.ObjectId, ref: "Seat" },
          toSeat: { type: Schema.Types.ObjectId, ref: "Seat" },
          date: Date,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ seatId: 1, status: 1 });
subscriptionSchema.index({ seatId: 1, endDate: 1 });

export const Subscription =
  models.Subscription || model("Subscription", subscriptionSchema);
