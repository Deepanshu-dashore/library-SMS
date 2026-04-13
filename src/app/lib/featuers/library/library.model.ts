import { Schema, model, models } from "mongoose";

const librarySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    floors: {
      type: [String],
    },
    helpDesk: {
      type: {
        name: { type: String },
        number: { type: String },
        email: { type: String },
        address: { type: String },
        hours: { type: String },
        holidays: { type: [String] },
      },
    },
    address: {
      type: String,
    },
    logo: {
      type: String,
    },
    signature: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Library = models.Library || model("Library", librarySchema);
