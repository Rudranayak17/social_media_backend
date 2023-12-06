import express from "express";
import { login, register } from "../controller/userController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(upload.single("avatar"),register);
router.route("/login").post(login);

export default router;