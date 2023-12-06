import { Request, Response, NextFunction } from 'express';
import { catchAsyncFunc } from '../middleware/catchAsyncFunc.js';
import User, { IUser } from '../model/usermodel.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/sendToken.js';
import bcrypt from 'bcrypt';
import cloudinary  from "cloudinary";
import fs from "fs";


export const register = catchAsyncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;
  const avatar = req.file?.path;

  if (!avatar) {
    return next(new ErrorHandler('Profile is missing', 400));
  }

  let user: IUser | null = await User.findOne({ email });

  if (user) {
    fs.unlinkSync(avatar);
    return next(new ErrorHandler('User already registered', 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: 'social-media-profile',
  });
  fs.unlinkSync(avatar);

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});
export const login = catchAsyncFunc(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler(`Enter All the fields`, 400));
  }

  let user = (await User.findOne({ email }).select('+password')) as IUser | null;


  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  sendToken(user, 201, res);
});


