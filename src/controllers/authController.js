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
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../models/User"));
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    const { username, email, password } = req.body;
    //express validator check
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => {
            return {
                msg: error.msg,
            };
        });
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ errors, data: null });
    }
    //check if email and usename exist
    const user = yield User_1.default.findOne({ email });
    const userUsername = yield User_1.default.findOne({ username });
    //return error if user exist
    if (user) {
        return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
            errors: [
                {
                    msg: "Email already in use",
                },
            ],
            data: null,
        });
    }
    //return error if username exist
    if (userUsername) {
        return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
            errors: [
                {
                    msg: "Username already in use",
                },
            ],
            data: null,
        });
    }
    //create new user
    const newUser = yield User_1.default.create({
        username,
        email,
        password,
    });
    //create JWT token
    const token = newUser.createJWT();
    //return response => no error, token, newly created user
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({
        errors: [],
        data: {
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
            },
        },
    });
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    const { email, password } = req.body;
    //express validator check
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => {
            return {
                msg: error.msg,
            };
        });
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ errors, data: null });
    }
    //check if user exist
    const user = yield User_1.default.findOne({ email }).select("+password");
    //return error is user doesn't exist
    if (!user) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            errors: [
                {
                    msg: "Email do not exist",
                },
            ],
            data: null,
        });
    }
    //check if db password match the logged password
    const isPasswordCorrect = yield user.comparePassword(password);
    //return error if passwords dont match
    if (!isPasswordCorrect) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            errors: [
                {
                    msg: "Password incorrects",
                },
            ],
            data: null,
        });
    }
    //create JWT token
    const token = user.createJWT();
    //hide the db password
    user.password = undefined;
    //return response => no error, token, logged user
    res.status(http_status_codes_1.StatusCodes.OK).json({
        errors: [],
        data: {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        },
    });
});
