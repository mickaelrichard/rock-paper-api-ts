import { Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const checkAuth = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "unauthorized",
        },
      ],
    });
  }
  try {
    const user = JWT.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
    };

    req.user = user.email;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "Not authorized to access this router",
        },
      ],
    });
  }
};
