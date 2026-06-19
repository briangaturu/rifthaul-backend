import { Router } from "express";
import {
    createTruck,
    getAllTrucks,
    getTruckById,
    getMyTrucks,
    updateTruck,
    updateTruckStatus,
    deleteTruck
} from "./truck.controller";
import { verifyToken, requireRole } from "../middleware/auth.middleware";

export const truckRouter = Router();

// Trucks routes definition
truckRouter.post('/trucks', verifyToken, requireRole('transporter'), createTruck);
truckRouter.get('/trucks', getAllTrucks); // public — businesses browse trucks
truckRouter.get('/trucks/mine', verifyToken, requireRole('transporter'), getMyTrucks);
truckRouter.get('/trucks/:id', getTruckById);
truckRouter.put('/trucks/:id', verifyToken, requireRole('transporter'), updateTruck);
truckRouter.patch('/trucks/:id/status', verifyToken, requireRole('transporter'), updateTruckStatus);
truckRouter.delete('/trucks/:id', verifyToken, requireRole('transporter'), deleteTruck);