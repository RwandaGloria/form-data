import { Router } from "express";
const userRouter = Router();
import Validation from "../validators/userValidators";
import UserController from "../controllers/controller";

const validation = new Validation();

userRouter.post("/add", [validation.validateCreateUser, UserController.createUserData]);
userRouter.get("/list", UserController.getAllUserData);
userRouter.patch("/update", [validation.validateUpdateUser, UserController.updateUserData]);
userRouter.delete("/remove", [validation.validateDeleteUser, UserController.deleteUser])


export default userRouter;