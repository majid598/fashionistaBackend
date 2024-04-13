    import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import { deleteUser, editUserRoll } from "../Controllers/admin.js";
const Router = express.Router();

Router.put("/user/role", isAuthenticated, editUserRoll);

Router.delete("/user/:id", deleteUser);

export default Router;
