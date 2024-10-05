import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { User } from "../Models/User.js";
import ErrorHandler from "../Utils/utility.js";
import { stripe } from "../app.js";

const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { name, email, amount } = req.body;

  // Ensure required fields are provided
  if (!name || !email || !amount)
    return next(
      new ErrorHandler(
        "Please provide all required fields: name, email and amount.",
        400
      )
    );
  // Find the user by name or email
  const user = await User.findOne({ $or: [{ name }, { email }] });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Account not found. Invalid name or email.",
    });
  }

  let customer = null;

  // Check if the user already has a Stripe customer ID
  if (user.cusId) {
    customer = { id: user.cusId };
  } else {
    // If no customer ID, create a new Stripe customer
    customer = await stripe.customers.create({
      name,
      email,
    });

    if (!customer)
      return next(new ErrorHandler("Error creating Stripe customer.", 500));

    // Save customer ID to the user model
    user.cusId = customer.id;
    await user.save();
  }

  // Create a PaymentIntent for the ecommerce order
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Ensure amount is converted to smallest currency unit
    currency: "usd",
    customer: customer.id,
    description: "perchased something from exclusive",
    receipt_email: email,
    payment_method_types: ["card"],
    metadata: {
      name,
      email,
      company: "Exclusive",
    },
  });

  return res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
    customer,
    message: "Payment processing initiated",
  });
});

export { createPaymentIntent };
