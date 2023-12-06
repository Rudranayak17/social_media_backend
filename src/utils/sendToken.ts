import { Response } from 'express';
import { IUser } from '../model/usermodel';

interface MyCookieOptions {
  maxAge: number;
  sameSite: "lax" | "strict" | "none";
  httpOnly: boolean;
  secure: boolean;
}

const sendToken = <T extends IUser>(
  user: T,
  statusCode = 200,
  res: Response,
) => {
  const token = user.getJWTToken();

  // Options for the Cookie
  const options: MyCookieOptions = {
    maxAge: (
      (parseInt(process.env.COOKIE_EXPIRE || '1', 10) || 1) * 24 * 60 * 60 * 1000
    ) || 0,
    sameSite: process.env.NODE_ENV === 'development' ? "lax" : "none",
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user,
      token,
    });
};

export default sendToken;
