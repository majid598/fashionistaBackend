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

Router.get("/me", isAuthenticated, myProfile);

Router.post("/download", async (req, res) => {
  const { videoUrl } = req.body;

  // Assuming the videoUrl is something like https://www.instagram.com/p/VIDEO_ID/
  const videoId = videoUrl.split("/p/")[1].split("/")[0];
  const videoDownloadUrl = `https://www.instagram.com/p/${videoId}/media/?size=l`;

  try {
    const response = await axios.get(videoDownloadUrl, {
      responseType: "stream",
    });

    const filePath = `downloads/${videoId}.mp4`;
    const writeStream = fs.createWriteStream(filePath);
    response.data.pipe(writeStream);

    writeStream.on("finish", () => {
      res.json({ downloadUrl: `http://yourdomain.com/${filePath}` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download video" });
  }
});

Router.put("/update/profile", isAuthenticated, updateProfile);

export default Router;
