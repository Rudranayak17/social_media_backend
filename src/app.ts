import express from "express";

import user from "./router/userRoute.js";
import cookieParser from "cookie-parser";
import { errMiddleware } from "./middleware/error.js";



export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", user);


app.use(errMiddleware);

app.get("/", (req, res) => {
    res.send("Server is working Properly");
});
