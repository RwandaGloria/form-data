import mongoose from 'mongoose';
import dotenv from "dotenv";
import logger from './logger';
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL!);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;
