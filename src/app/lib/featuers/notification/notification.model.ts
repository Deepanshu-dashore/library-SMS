import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // "expiry"
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "sent"],
  },
});

export const Notification =
  models.Notification || model("Notification", notificationSchema);
