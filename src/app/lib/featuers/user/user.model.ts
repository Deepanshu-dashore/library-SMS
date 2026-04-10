import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: Date, required: true },
    maritalStatus: {
      type: String,
      enum: ["Unmarried", "Married"],
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    secondaryNumber: {
      type: String,
    },
    category: {
      type: String,
      enum: ["General", "SC", "ST", "OBC", "EWS"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    address: {
      type: {
        detailedAddress: { type: String, required: true },
        tehsil: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    adharNumber: { type: String, required: true },
    signature: { type: String },
    photo: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Unverify"],
      default: "Unverify",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    course: { type: String },
  },
  { timestamps: true },
);

export const User = models.User || model("User", userSchema);
