import { Request, Response } from "express";
import {
    createShipmentServices,
    getAllShipmentsServices,
    getOpenShipmentsServices,
    getShipmentByIdServices,
    getShipmentsByBusinessServices,
    getShipmentsByTransporterServices,
    updateShipmentServices,
    updateShipmentStatusServices,
    deleteShipmentServices
} from "./shipment.service";
import { ShipmentValidator, ShipmentUpdateValidator, ShipmentStatusValidator } from "../validation/validator";
import { parseIdParam } from "../utils/params";

export const createShipment = async (req: Request, res: Response) => {
    try {
        const parseResult = ShipmentValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }

        const businessId = req.user!.userId;
        const shipment = { ...parseResult.data, businessId };

        const newShipment = await createShipmentServices(shipment);
        res.status(201).json({ message: "Shipment posted successfully", shipment: newShipment });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to post shipment" });
    }
}

export const getAllShipments = async (req: Request, res: Response) => {
    try {
        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const shipments = await getAllShipmentsServices(search);
        res.status(200).json(shipments);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch shipments" });
    }
}

export const getOpenShipments = async (req: Request, res: Response) => {
    try {
        const shipments = await getOpenShipmentsServices();
        res.status(200).json(shipments);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch open shipments" });
    }
}

export const getShipmentById = async (req: Request, res: Response) => {
    try {
        const shipmentId = parseIdParam(req.params.id);
        const shipment = await getShipmentByIdServices(shipmentId);

        if (!shipment) {
            res.status(404).json({ error: "Shipment not found" });
            return;
        }

        res.status(200).json(shipment);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch shipment" });
    }
}

export const getMyShipments = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const userType = req.user!.userType;

        const shipments = userType === 'transporter'
            ? await getShipmentsByTransporterServices(userId)
            : await getShipmentsByBusinessServices(userId);

        res.status(200).json(shipments);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch your shipments" });
    }
}

export const updateShipment = async (req: Request, res: Response) => {
    try {
        const shipmentId = parseIdParam(req.params.id);

        const parseResult = ShipmentUpdateValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }

        const updatedShipment = await updateShipmentServices(shipmentId, parseResult.data);
        res.status(200).json({ message: "Shipment updated successfully", shipment: updatedShipment });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update shipment" });
    }
}

export const updateShipmentStatus = async (req: Request, res: Response) => {
    try {
        const shipmentId = parseIdParam(req.params.id);

        const parseResult = ShipmentStatusValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }

        const { status, transporterId, truckId } = parseResult.data;
        const updatedShipment = await updateShipmentStatusServices(shipmentId, status, transporterId, truckId);

        res.status(200).json({ message: "Shipment status updated", shipment: updatedShipment });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update shipment status" });
    }
}

export const deleteShipment = async (req: Request, res: Response) => {
    try {
        const shipmentId = parseIdParam(req.params.id);
        const result = await deleteShipmentServices(shipmentId);
        res.status(200).json({ message: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete shipment" });
    }
}