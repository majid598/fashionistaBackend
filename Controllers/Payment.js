import { TryCatch } from "../Middlewares/errorMiddleware.js";
import { User } from "../Models/User.js";
import ErrorHandler from "../Utils/utility.js";
import { stripe } from '../app.js'


const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount, email, name, address } = req.body;
    console.log(amount, email, name, address)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // amount should be in cents (e.g., $10 = 1000)
        currency: "usd",
    });
    console.log(paymentIntent.client_secret)

    return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});


export { createPaymentIntent };