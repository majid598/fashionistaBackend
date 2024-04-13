import ErrorHandler from "../Utils/utility.js";
import jwt from "jsonwebtoken";
import { TryCatch } from "./errorMiddleware.js";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies["fashionista-token"];

  if (!token) return next(new ErrorHandler("Please Login first", 404));

  const decodeData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodeData._id;

  next();
};
