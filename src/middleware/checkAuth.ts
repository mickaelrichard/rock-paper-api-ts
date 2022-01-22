import { StatusCodes } from "http-status-codes";
import { Response, NextFunction } from "express";
import JWT from "jsonwebtoken";

export const checkAuth = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let token;

  //get token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //return error if no token
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "missing token",
        },
      ],
    });
  }

  //verify the token
  try {
    const user = JWT.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
    };
    //assign the user email to the request
    req.user = user.email;
    next();
  } catch (error) {
    //return error if issue in the process
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "Not authorized to access this router",
        },
      ],
    });
  }
};
