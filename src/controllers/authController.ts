import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";

exports.signup = async (req: Request, res: Response) => {
  const validationErrors = validationResult(req);
  const { username, email, password } = req.body;

  //express validator check
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => {
      return {
        msg: error.msg,
      };
    });
    return res.status(StatusCodes.UNAUTHORIZED).json({ errors, data: null });
  }

  //check if email and usename exist
  const user = await User.findOne({ email });
  const userUsername = await User.findOne({ username });

  //return error if user exist
  if (user) {
    return res.status(StatusCodes.CONFLICT).json({
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
    return res.status(StatusCodes.CONFLICT).json({
      errors: [
        {
          msg: "Username already in use",
        },
      ],
      data: null,
    });
  }

  //create new user
  const newUser = await User.create({
    username,
    email,
    password,
  });

  //create JWT token
  const token = newUser.createJWT();

  //return response => no error, token, newly created user
  return res.status(StatusCodes.CREATED).json({
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
};

exports.login = async (req: Request, res: Response) => {
  const validationErrors = validationResult(req);
  const { email, password } = req.body;

  //express validator check
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => {
      return {
        msg: error.msg,
      };
    });
    return res.status(StatusCodes.UNAUTHORIZED).json({ errors, data: null });
  }

  //check if user exist
  const user = await User.findOne({ email }).select("+password");

  //return error is user doesn't exist
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "Email do not exist",
        },
      ],
      data: null,
    });
  }
  //check if db password match the logged password
  const isPasswordCorrect = await user.comparePassword(password);

  //return error if passwords dont match
  if (!isPasswordCorrect) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "Password incorrect",
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
  res.status(StatusCodes.OK).json({
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
};
