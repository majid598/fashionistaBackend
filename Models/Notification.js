import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model("Notification", schema);
