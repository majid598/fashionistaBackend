import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { Notification } from "../Models/Notification.js";
import { User } from "../Models/User.js";
import ErrorHandler from "../Utils/utility.js";

const editUserRoll = TryCatch(async (req, res, next) => {
  const { userId, role } = req.body;

  if (!role)
    return next(new ErrorHandler("Please Enter Role For this Uer", 404));

  const user = await User.findById(userId);

  user.role = role;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "User Role updated successfully",
  });
});

const deleteUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  const username = user.name;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User Not Found",
    });
  }

  await user.deleteOne();

  await Notification.create({
    message: `${username} Deleted By Mr majid`,
  });

  await res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

export { editUserRoll, deleteUser };
