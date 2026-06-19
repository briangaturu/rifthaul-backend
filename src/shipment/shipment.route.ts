import { Router } from "express";
import {
    createShipment,
    getAllShipments,
    getOpenShipments,
    getShipmentById,
    getMyShipments,
    updateShipment,
    updateShipmentStatus,
    deleteShipment
} from "./shipment.controller";
import { verifyToken, requireRole } from "../middleware/auth.middleware";

export const shipmentRouter = Router();

// Shipments routes definition
shipmentRouter.post('/shipments', verifyToken, requireRole('business'), createShipment);
shipmentRouter.get('/shipments', getAllShipments); // public — marketplace browsing
shipmentRouter.get('/shipments/open', getOpenShipments); // public — transporters browse open jobs
shipmentRouter.get('/shipments/mine', verifyToken, getMyShipments);
shipmentRouter.get('/shipments/:id', getShipmentById);
shipmentRouter.put('/shipments/:id', verifyToken, requireRole('business'), updateShipment);
shipmentRouter.patch('/shipments/:id/status', verifyToken, updateShipmentStatus);
shipmentRouter.delete('/shipments/:id', verifyToken, requireRole('business'), deleteShipment);