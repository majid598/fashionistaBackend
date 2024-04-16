import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import { deleteUser, editUserRoll } from "../Controllers/admin.js";
import { getAdminSingleOrder } from "../Controllers/order.js";
const Router = express.Router();

Router.put("/user/role", editUserRoll);

Router.delete("/user/:id", deleteUser);

Router.get("/order/:id", getAdminSingleOrder);

export default Router;
