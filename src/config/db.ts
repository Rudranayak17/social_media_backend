import mongoose, { Connection } from "mongoose";

const connectDB = async (): Promise<void> => {
    
    try {
        const { connection }: { connection: Connection } = await mongoose.connect(
            process.env.MONGO_URL as string,
            {
                dbName: "social-media",
            }
        );
        console.log(`MongoDB connected to ${connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;
