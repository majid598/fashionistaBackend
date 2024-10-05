import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import { addToCart, cart, increase, decrease, removeFromCart, resetCart, moveWishlistToCart } from "../Controllers/Cart.js";
const Router = express.Router();

Router.get("/add-item/:id", isAuthenticated, addToCart);
Router.get("/", isAuthenticated, cart);
Router.get("/increase/:id", isAuthenticated, increase);
Router.get("/decrease/:id", isAuthenticated, decrease);
Router.get("/remove-item/:id", isAuthenticated, removeFromCart);
Router.get("/reset", isAuthenticated, resetCart);
Router.get("/move-to-cart", isAuthenticated, moveWishlistToCart);

export default Router;
