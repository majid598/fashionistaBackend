import jwt from "jsonwebtoken";
import { Product } from "../Models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { Order } from "../Models/Order.js";

export const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

export const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return res
    .status(code)
    .cookie("fashionista-token", token, cookieOptions)
    .json({
      success: true,
      message,
      user,
    });
};

export const generateUniqueID = async () => {
  let uniqueID = Math.floor(10000000 + Math.random() * 90000000);
  return uniqueID;
}


export const reduceStock = async (orderItems) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.products);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};

cloudinary.config({
  cloud_name: "dfmcsvthn",
  api_key: "421174188571662",
  api_secret: "DZfi0pptneCXwtm0_6piJj-A9Sw",
});


const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

// Function to upload a file to Cloudinary
export const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err) {
    throw new Error("Error uploading files to cloudinary", err);
  }
};