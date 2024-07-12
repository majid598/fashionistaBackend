import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
const app = express();


dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server Working");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { connectDb } from "./Utils/Db.js";

import { errorMiddleware } from "./Middlewares/errorMiddleware.js";
import cartRoute from "./Routes/Cart.js";
import Notification from "./Routes/Notification.js";
import productRoute from "./Routes/Product.js";
import userRoute from "./Routes/User.js";
import adminRoute from "./Routes/admin.js";
import orderRoute from "./Routes/order.js";
import reviewRoute from "./Routes/review.js";

connectDb(process.env.MONGO_URI);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/notification", Notification);
app.use("/api/v1/cart", cartRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at port number ${PORT} `);
});
