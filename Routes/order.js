import express from "express";
import {
  allOrders,
  cancelOrder,
  cancelations,
  createOrder,
  getSingleOrder,
  myOrders,
  statusUpdate, stats
} from "../Controllers/order.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const Router = express.Router();

Router.post("/create", isAuthenticated, createOrder);

Router.get("/admin/stats", isAuthenticated, stats);

Router.get("/all", allOrders);

Router.get("/my", myOrders);

Router.get("/cancelations", cancelations);

Router.put("/cancel/:id", cancelOrder);

Router.route("/:id").get(getSingleOrder).put(statusUpdate);

export default Router;
