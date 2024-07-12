import { compare } from "bcrypt";
import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { Notification } from "../Models/Notification.js";
import { User } from "../Models/User.js";
import {
  cookieOptions,
  sendToken,
  uploadFilesToCloudinary,
} from "../Utils/features.js";
import ErrorHandler from "../Utils/utility.js";
import { Product } from "../Models/Product.js";
import { v2 as cloudinary } from "cloudinary";

const newUser = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message: "All Fields Are Required",
    });
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    res.status(400).json({
      success: false,
      message: "Email Already Exist",
    });
  }

  const user = await User.create({
    name,
    username: name,
    email,
    password,
  });

  await Notification.create({
    message: `${user.name} joined your website`,
  });

  sendToken(res, user, 200, `Welcome Mr ${user.name}`);
});

const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Email Or Password", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch) return next(new ErrorHandler("Invalid Email Or Password", 404));

  sendToken(res, user, 200, `Welcome Back Mr ${user.name}`);
});

const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("fashionista-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const myProfile = TryCatch(async (req, res, next) => {
  const userId = req.user;
  const user = await User.findById(userId);

  if (!user) return next(new ErrorHandler("User Not Found", 400));

  res.status(200).json({
    success: true,
    user,
  });
});

const profilePic = TryCatch(async (req, res, next) => {
  const { profile } = req.body;

  if (!profile) return next(new ErrorHandler("Please Select a photo", 404));

  const user = await User.findById(req.user);

  user.profile = profile;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile Pic Updated",
  });
});

const allUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

const wishlist = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user).populate("likedProducts", "name salePrice regularPrice images seller numOfReviews");


  return res.status(200).json({
    success: true,
    products: user.likedProducts,
  });
});

const updateProfile = TryCatch(async (req, res, next) => {
  const image = req.file;
  const user = await User.findById(req.user);
  if (!image) return next(new ErrorHandler("Please select an image", 400));

  if (user.profile.public_id) {
    await cloudinary.uploader.destroy(user.profile.public_id);
  }

  const result = await uploadFilesToCloudinary([image]);
  console.log(result);
  user.profile.public_id = result[0].public_id;
  user.profile.url = result[0].url;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Update Successfully",
  });
});

const deleteNotification = TryCatch(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  await notification.deleteOne();
  return res.status(200).json({
    success: true,
    message: "Notifiction Removed",
  });
});

const allNotifications = TryCatch(async (req, res, next) => {
  const notifications = await Notification.find({});

  return res.status(200).json({
    success: true,
    notifications,
  });
});

const getUserById = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  return res.status(200).json({
    success: true,
    user,
  });
});


export {
  allNotifications,
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
};
