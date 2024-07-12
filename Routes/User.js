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
  wishlist,
} from "../Controllers/User.js";
import { singleAvatar } from "../Middlewares/Multer.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const Router = express.Router();

Router.post("/new", newUser);

Router.post("/upload", isAuthenticated, profilePic);

Router.post("/login", login);

Router.get("/logout", isAuthenticated, logout);

Router.get("/all", allUsers);

Router.get("/wishlist", isAuthenticated, wishlist);

Router.get("/admin/:id", getUserById);

Router.get("/other/:id", getUserById);

Router.get("/other/:id/profile", getUserById);

Router.get("/me", isAuthenticated, myProfile);

Router.put("/update/profile", isAuthenticated, singleAvatar, updateProfile);

export default Router;
