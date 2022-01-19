import { Request, Response, NextFunction } from "express";

// import User from '../models/User'
exports.signup = async (req: Request, res: Response, next: NextFunction) => {};

exports.login = async (req: Request, res: Response, next: NextFunction) => {};

exports.me = async (req: Request, res: Response, next: NextFunction) => {
  res.send("test me");
};
