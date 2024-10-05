import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please Enter product Name"],
      trim: true,
    },
    brandName: {
      type: String,
      required: [true, "Please Enter product Brand Name"],
      trim: true,
    },
    colors: [String],
    sizes: [String],
    size: String,
    weight: String,
    unit: String,
    regularPrice: {
      type: Number,
      required: [true, "Please Enter product Regular Price"],
    },
    salePrice: {
      type: Number,
      required: [true, "Please Enter product Sale Price"],
    },
    type: {
      type: String,
      required: [true, "Please Enter product type"],
    },
    stockStatus: {
      type: String,
      required: [true, "Please Enter product Stack Status"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Please Enter product Stock Quantity"],
      default: 1,
    },
    unit: {
      type: String,
      required: [true, "Please Enter product unit"],
      default: "kg",
    },
    attributes: [String],
    category: {
      type: String,
      required: [true, "Please Enter Product Category"],
    },
    description: {
      type: String,
      required: [true, "Please Enter product Description"],
    },
    images: [
      {
        _id: false,
        public_id: String,
        url: String,
      },
    ],
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          _id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          profile: String,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    sold: { type: Number, default: 0 },
    flashSale: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
