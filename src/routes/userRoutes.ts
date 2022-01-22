import express from "express";
const router = express.Router();
const userController = require("./../controllers/userController");
import { checkAuth } from "../middleware/checkAuth";

router.get("/me", checkAuth, userController.me);

export default router;
