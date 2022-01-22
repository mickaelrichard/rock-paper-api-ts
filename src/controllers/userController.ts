import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";

exports.me = async (req: any, res: Response) => {
  //find user
  const user = await User.findOne({ email: req.user });
  //return response => no error, user
  return res.status(StatusCodes.OK).json({
    errors: [],
    data: {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    },
  });
};
