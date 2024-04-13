import express from "express";
import { allNotifications, deleteNotification } from "../Controllers/User.js";
const Router = express.Router();

Router.get("/all", allNotifications);

Router.route("/:id").delete(deleteNotification);

export default Router;
