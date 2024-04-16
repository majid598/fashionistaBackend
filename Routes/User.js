import express from "express";
import fs from "fs";
import axios from "axios";
import {
  allUsers,
  deleteNotification,
  getUserById,
  login,
  logout,
  myProfile,
  newUser,
  profilePic,
  updateProfile,
} from "../Controllers/User.js";
import { upload } from "../Middlewares/Multer.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const Router = express.Router();

Router.post("/new", newUser);

Router.post("/upload", upload.single("image"), profilePic);

Router.post("/login", login);

Router.get("/logout", logout);

Router.get("/all", allUsers);

Router.get("/admin/:id", getUserById);

Router.get("/other/:id", getUserById);

Router.get("/other/:id/profile", getUserById);

Router.get("/me", isAuthenticated, myProfile);

Router.put("/update/profile", updateProfile);

export default Router;
