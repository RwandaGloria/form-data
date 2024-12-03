import { Request, Response } from "express";
import User from "../models/user";
import { IUser } from "../models/user";
import out from "../helpers/out";
import logger from "../config/logger";
import { io } from "../server";  // Import the `io` instance

export default class UserController {
    private static errorCode = "USC";

    static createUserData = async (req: Request, res: Response) => {
        try {
            const body: IUser = req.body;
            const newUser = await User.create(body);

            io.emit("userCreated", newUser); 

            return out(res, 201, newUser, "User data created successfully", undefined);
        } catch (error: any) {
            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyValue || {}).join(', ');
                return out(res, 409, undefined, `Duplicate entry for ${duplicateField}`, `${this.errorCode}1-1`);
            }
            logger.error(error);
            return out(res, 500, undefined, "Internal Server Error", `${this.errorCode}1-0`);
        }
    };

    static getAllUserData = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await User.find();
            if (users.length === 0) {
                return out(res, 200, users, "No users data", `${this.errorCode}2-1`);
            }
            return out(res, 200, users, "User data retrieved successfully", undefined);
        } catch (error: any) {
            logger.error(error);
            return out(res, 500, undefined, "Internal Server Error", `${this.errorCode}2-0`);
        }
    };

    static updateUserData = async (req: Request, res: Response) => {
        try {
            const { userId, ...updates } = req.body;
            const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
            if (!updatedUser) {
                return out(res, 404, undefined, "User not found", `${UserController.errorCode}3-1`);
            }

            io.emit("userUpdated", updatedUser);

            return out(res, 200, updatedUser, "User updated successfully", undefined);
        } catch (error: any) {
            logger.error(error);
            return out(res, 500, undefined, "Failed to update user", `${UserController.errorCode}3-0`);
        }
    };

    static deleteUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.query;
            const deletedUser = await User.findByIdAndDelete(userId);

            io.emit("userDeleted", deletedUser); 

            return out(res, 200, deletedUser, "User deleted successfully", undefined);
        } catch (error: any) {
            logger.error(error);
            return out(res, 500, undefined, "Failed to delete user", `${UserController.errorCode}4-0`);
        }
    };

    static getSingleUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.query;
            const getUser = await User.findById(userId);

            if(!getUser) {
                return out(res, 404, {}, "No user data found", undefined);
            }
            io.emit("userGotten", getUser); 

            return out(res, 200, getUser, "User fetched successfully", undefined);
        } catch (error: any) {
            logger.error(error);
            return out(res, 500, undefined, "Failed to get user", `${UserController.errorCode}5-0`);
        }
    };
}
