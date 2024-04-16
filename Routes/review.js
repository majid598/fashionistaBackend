import express from "express";
import { addReview } from "../Controllers/review.js";
const Router = express.Router();

Router.post("/add", addReview);


export default Router;
