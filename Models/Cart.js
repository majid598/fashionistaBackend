import mongoose from "mongoose";
import { hash } from "bcrypt";
import validator from "validator";

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export const Cart = mongoose.model("Cart", schema);
