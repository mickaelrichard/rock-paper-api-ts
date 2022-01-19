import { Response, NextFunction } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";

exports.me = async (req: any, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.user });
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
