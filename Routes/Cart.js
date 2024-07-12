import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import { addToCart, cart, increase, decrease } from "../Controllers/Cart.js";
const Router = express.Router();

Router.get("/add-item/:id", isAuthenticated, addToCart);
Router.get("/", isAuthenticated, cart);
Router.get("/increase/:id", isAuthenticated, increase);
Router.get("/decrease/:id", isAuthenticated, decrease);

export default Router;
