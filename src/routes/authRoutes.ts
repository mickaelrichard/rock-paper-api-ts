import rateLimiter from "express-rate-limit";
import { body } from "express-validator";
import express from "express";
const authController = require("./../controllers/authController");

const router = express.Router();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.post(
  "/signup",
  body("username").isLength({ min: 3 }).withMessage("The username is invalid"),
  body("email").isEmail().withMessage("The email is invalid"),
  body("password").isLength({ min: 5 }).withMessage("The password is invalid"),
  apiLimiter,
  authController.signup
);

router.post(
  "/login",
  body("email").not().isEmpty().withMessage("The email is required"),
  body("password").not().isEmpty().withMessage("The password is required"),
  apiLimiter,
  authController.login
);

export default router;
