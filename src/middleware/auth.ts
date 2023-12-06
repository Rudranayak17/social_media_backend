import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { catchAsyncFunc } from "./catchAsyncFunc";
import User, { IUser } from "../model/usermodel";
import ErrorHandler from "../utils/errorHandler";

// Extend the Request interface to include the user property
interface AuthRequest extends Request {
  user?: IUser;
}

export const isAuthenticated = catchAsyncFunc(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    console.log("Token is missing");
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    // Check if token is defined before verifying
    const decodedData = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload & { id: string };
    req.user = (await User.findById(decodedData.id)) as IUser;

    if (!req.user) {
      console.log("User not found");
      return next(new ErrorHandler("User not found", 401));
    }

    next();
  } catch (error) {
    console.error("JWT verification error: ", error);
    return next(new ErrorHandler("Invalid token", 401));
  }
});

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string)) {
      return next(new ErrorHandler(`Role: ${req.user?.role} is not authorized to access this resource`, 403));
    }
    next();
  };
};
