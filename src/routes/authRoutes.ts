import express from "express";
const authController = require("./../controllers/authController");
// import bcrypt from "bcryptjs";
// import JWT from "jsonwebtoken";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authController.me);

export default router;
