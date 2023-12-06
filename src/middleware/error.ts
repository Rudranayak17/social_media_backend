import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler.js';

interface CustomError extends Error {
  statusCode: number;
  path?: string;
  name: string; // Make 'name' a required property
  code?: number;
  keyValue?: Record<string, any>;
}

export const errMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  err.message = err.message || 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  // wrong mongodb id error
  if (err.name === 'CastError' && err instanceof ErrorHandler) {
    const message = `Resource not Found - Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate Key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue || {}).join(', ')} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web Token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // wrong JWT EXPIRE error
  if (err.name === 'TokenExpiredError') {
    const message = `Json Web Token is Expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
