import { app } from "./app.js";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import * as cloudinary from "cloudinary";
config()
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  });
  
connectDB()
const port = process.env.PORT as string;
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
}).on('error', (err) => {
    console.error('Error starting server:', err);
});
