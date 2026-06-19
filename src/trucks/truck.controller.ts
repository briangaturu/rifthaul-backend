import { Request, Response } from "express";
import {
    createTruckServices,
    getAllTrucksServices,
    getTruckByIdServices,
    getTrucksByTransporterServices,
    updateTruckServices,
    updateTruckStatusServices,
    deleteTruckServices
} from "./truck.service";
import { TruckValidator, TruckUpdateValidator, TruckStatusValidator } from "../validation/validator";
import { parseIdParam } from "../utils/params";

export const createTruck = async (req: Request, res: Response) => {
    try {
        const parseResult = TruckValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }

        const transporterId = req.user!.userId;
        const truck = { ...parseResult.data, transporterId };

        const newTruck = await createTruckServices(truck);
        res.status(201).json({ message: "Truck registered successfully", truck: newTruck });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to register truck" });
    }
}

export const getAllTrucks = async (req: Request, res: Response) => {
    try {
        const location = typeof req.query.location === 'string' ? req.query.location : undefined;
        const trucks = await getAllTrucksServices(location);
        res.status(200).json(trucks);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch trucks" });
    }
}

export const getTruckById = async (req: Request, res: Response) => {
    try {
        const truckId = parseIdParam(req.params.id);
        const truck = await getTruckByIdServices(truckId);

        if (!truck) {
            res.status(404).json({ error: "Truck not found" });
            return;
        }

        res.status(200).json(truck);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch truck" });
    }
}

export const getMyTrucks = async (req: Request, res: Response) => {
    try {
        const transporterId = req.user!.userId;
        const trucks = await getTrucksByTransporterServices(transporterId);
        res.status(200).json(trucks);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch your trucks" });
    }
}

export const updateTruck = async (req: Request, res: Response) => {
    try {
        const truckId = parseIdParam(req.params.id);

        const parseResult = TruckUpdateValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }

        const updatedTruck = await updateTruckServices(truckId, parseResult.data);
        res.status(200).json({ message: "Truck updated successfully", truck: updatedTruck });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update truck" });
    }
}

export const updateTruckStatus = async (req: Request, res: Response) => {
    try {
        const truckId = parseIdParam(req.params.id);

        const parseResult = TruckStatusValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }

        const updatedTruck = await updateTruckStatusServices(truckId, parseResult.data.status);
        res.status(200).json({ message: "Truck status updated", truck: updatedTruck });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update truck status" });
    }
}

export const deleteTruck = async (req: Request, res: Response) => {
    try {
        const truckId = parseIdParam(req.params.id);
        const result = await deleteTruckServices(truckId);
        res.status(200).json({ message: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete truck" });
    }
}