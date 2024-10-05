import { createPaymentIntent } from '../Controllers/Payment.js';
import express from 'express';
import { isAuthenticated } from '../Middlewares/auth.js';
const router = express.Router();

// Create Payment Intent
router.post('/create', isAuthenticated, createPaymentIntent);

export default router;