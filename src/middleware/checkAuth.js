"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    //get token
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    //return error if no token
    if (!token) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            errors: [
                {
                    msg: "missing token",
                },
            ],
        });
    }
    //verify the token
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        //assign the user email to the request
        req.user = user.email;
        next();
    }
    catch (error) {
        //return error if issue in the process
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            errors: [
                {
                    msg: "Not authorized to access this router",
                },
            ],
        });
    }
});
exports.checkAuth = checkAuth;
