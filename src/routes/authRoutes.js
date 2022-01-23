"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_validator_1 = require("express-validator");
const express_1 = __importDefault(require("express"));
const authController = require("./../controllers/authController");
const router = express_1.default.Router();
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: "Too many requests from this IP, please try again after 15 minutes",
});
router.post("/signup", (0, express_validator_1.body)("username").isLength({ min: 3 }).withMessage("The username is invalid"), (0, express_validator_1.body)("email").isEmail().withMessage("The email is invalid"), (0, express_validator_1.body)("password").isLength({ min: 5 }).withMessage("The password is invalid"), apiLimiter, authController.signup);
router.post("/login", (0, express_validator_1.body)("email").not().isEmpty().withMessage("The email is required"), (0, express_validator_1.body)("password").not().isEmpty().withMessage("The password is required"), apiLimiter, authController.login);
exports.default = router;
