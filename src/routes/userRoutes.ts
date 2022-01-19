import express from "express";
const userController = require("./../controllers/userController");
const router = express.Router();
import { checkAuth } from "../middleware/checkAuth";

router.get("/me", checkAuth, userController.me);

export default router;
