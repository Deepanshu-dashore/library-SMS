import { Schema, model, models } from "mongoose";

const expenseSchema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ["electricity", "rent", "water", "maintenance", "other"],
    required: true,
  },
  receipt: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
  note: { type: String },
});

export const Expense = models.Expense || model("Expense", expenseSchema);
