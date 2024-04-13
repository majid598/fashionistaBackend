import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      // process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server Working");
});

import { connectDb } from "./Utils/Db.js";

import userRoute from "./Routes/User.js";
import productRoute from "./Routes/Product.js";
import adminRoute from "./Routes/admin.js";
import Notification from "./Routes/Notification.js";
import { errorMiddleware } from "./Middlewares/errorMiddleware.js";

connectDb(process.env.MONGO_URI);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/notification", Notification);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at port number ${PORT} `);
});
