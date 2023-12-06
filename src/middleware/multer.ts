import multer from "multer";
import path from "path";
import { Request } from "express";
import ErrorHandler from "../utils/errorHandler.js";

// Set up the Multer storage engine
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, './images'); // Store uploaded images in the 'public/images' directory
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Rename the uploaded file
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new ErrorHandler("Invalid file type. Only PNG or JPG files are allowed.",400));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
