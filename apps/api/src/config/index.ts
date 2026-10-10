import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/cartpilot",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  jwtSecret: process.env.JWT_SECRET || "cartpilot-super-secret-key-12345",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_CartPilotDemo1",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "CartPilotTestSecretKey987654",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "cartpilot_webhook_secret_key"
};
