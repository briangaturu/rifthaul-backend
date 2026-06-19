import { Request, Response } from "express";
import {
    getUserByIdServices,
    getAllTransportersServices,
    getAllBusinessesServices,
    updateUserServices,
    deleteUserServices
} from "./user.service";
import { UserUpdateValidator } from "../validation/validator";
import { parseIdParam } from "../utils/params";

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = parseIdParam(req.params.id);
        const user = await getUserByIdServices(userId);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Strip password before sending
        const { password, ...safeUser } = user;
        res.status(200).json(safeUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch user" });
    }
}

export const getAllTransporters = async (req: Request, res: Response) => {
    try {
        const transporters = await getAllTransportersServices();
        const safeList = transporters.map(({ password, ...rest }) => rest);
        res.status(200).json(safeList);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch transporters" });
    }
}

export const getAllBusinesses = async (req: Request, res: Response) => {
    try {
        const businesses = await getAllBusinessesServices();
        const safeList = businesses.map(({ password, ...rest }) => rest);
        res.status(200).json(safeList);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch businesses" });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseIdParam(req.params.id);

        const parseResult = UserUpdateValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }

        const updatedUser = await updateUserServices(userId, parseResult.data);
        const { password, ...safeUser } = updatedUser;

        res.status(200).json({ message: "User updated successfully", user: safeUser });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update user" });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = parseIdParam(req.params.id);
        const result = await deleteUserServices(userId);
        res.status(200).json({ message: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete user" });
    }
}