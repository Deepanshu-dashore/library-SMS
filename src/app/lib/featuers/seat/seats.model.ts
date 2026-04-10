import { Schema, model, models } from "mongoose";

const seatSchema = new Schema(
  {
    seatNumber: {
      type: String,
      required: true,
      unique: true, // S1, S2, A1 etc.
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["normal", "ac"],
      default: "normal",
    },
    floor: {
      type: String, // optional (if multi-floor)
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Seat = models.Seat || model("Seat", seatSchema);
