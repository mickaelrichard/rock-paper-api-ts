import express from "express";
const authController = require("./../controllers/authController");
// import bcrypt from "bcryptjs";
// import JWT from "jsonwebtoken"
import { body } from "express-validator";
const router = express.Router();

router.post(
  "/signup",
  body("username").isLength({ min: 3 }).withMessage("The username is invalid"),
  body("email").isEmail().withMessage("The email is invalid"),
  body("password").isLength({ min: 5 }).withMessage("The password is invalid"),
  authController.signup
);
router.post(
  "/login",
  body("email").not().isEmpty().withMessage("The email is required"),
  body("password").not().isEmpty().withMessage("The password is required"),
  authController.login
);

export default router;
