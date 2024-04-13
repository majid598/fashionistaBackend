import express from "express";
import {
  allProducts,
  deleteProduct,
  newProduct,
  getSingleProduct,
} from "../Controllers/Porduct.js";
import { upload } from "../Middlewares/Multer.js";
const Router = express.Router();

Router.post("/new", upload.array("images", 5), newProduct);

Router.get("/all", allProducts);

Router.route("/:id").delete(deleteProduct).get(getSingleProduct);

export default Router;
