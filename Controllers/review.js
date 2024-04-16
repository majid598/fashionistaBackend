import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { Product } from "../Models/Product.js";
import { User } from "../Models/User.js";
import ErrorHandler from "../Utils/utility.js";

const addReview = TryCatch(async (req, res, next) => {
  const { user, productId, rating, comment } = req.body;

  if (!rating || !comment)
    return next(new ErrorHandler("All Feilds Are Required", 404));

  const product = await Product.findById(productId);
  const review = { user, rating, comment };
  product.reviews.push(review);
  product.numOfReviews += 1;
  await product.save();

  return res.status(200).json({
    success: true,
    message: "Thanks For Your FeedBack",
  });
});

export { addReview };
