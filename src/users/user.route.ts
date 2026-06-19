import { Router } from "express";
import { getUserById, getAllTransporters, getAllBusinesses, updateUser, deleteUser } from "./user.controller";
import { verifyToken } from "../middleware/auth.middleware";

export const userRouter = Router();

// Users routes definition
userRouter.get('/users/transporters', verifyToken, getAllTransporters);
userRouter.get('/users/businesses', verifyToken, getAllBusinesses);
userRouter.get('/users/:id', verifyToken, getUserById);
userRouter.put('/users/:id', verifyToken, updateUser);
userRouter.delete('/users/:id', verifyToken, deleteUser);