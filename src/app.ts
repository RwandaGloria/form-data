import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRouter from './routes/userRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);

connectDB();

export default app;
