import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }],
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const FlashSale = mongoose.model("FlashSale", schema);
