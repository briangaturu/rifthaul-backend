import { eq, ilike, or } from "drizzle-orm";
import db from "../drizzle/db";
import { TShipmentInsert, TShipmentSelect, shipmentTable } from "../drizzle/schema";

// Create a shipment
export const createShipmentServices = async (shipment: TShipmentInsert): Promise<TShipmentSelect> => {
    const result = await db.insert(shipmentTable).values(shipment).returning();
    return result[0];
}

// Get all shipments (optionally filter by route/cargo search)
export const getAllShipmentsServices = async (search?: string): Promise<TShipmentSelect[]> => {
    if (search) {
        return await db.query.shipmentTable.findMany({
            where: or(
                ilike(shipmentTable.origin, `%${search}%`),
                ilike(shipmentTable.destination, `%${search}%`),
                ilike(shipmentTable.cargoType, `%${search}%`)
            )
        });
    }
    return await db.query.shipmentTable.findMany();
}

// Get open shipments only (for transporters browsing the marketplace)
export const getOpenShipmentsServices = async (): Promise<TShipmentSelect[]> => {
    return await db.query.shipmentTable.findMany({
        where: eq(shipmentTable.status, 'open')
    })
}

// Get shipment by id
export const getShipmentByIdServices = async (shipmentId: number): Promise<TShipmentSelect | undefined> => {
    return await db.query.shipmentTable.findFirst({
        where: eq(shipmentTable.shipmentId, shipmentId)
    })
}

// Get shipments posted by a business
export const getShipmentsByBusinessServices = async (businessId: number): Promise<TShipmentSelect[]> => {
    return await db.query.shipmentTable.findMany({
        where: eq(shipmentTable.businessId, businessId)
    })
}

// Get shipments assigned to a transporter
export const getShipmentsByTransporterServices = async (transporterId: number): Promise<TShipmentSelect[]> => {
    return await db.query.shipmentTable.findMany({
        where: eq(shipmentTable.transporterId, transporterId)
    })
}

// Update shipment details
export const updateShipmentServices = async (shipmentId: number, updates: Partial<TShipmentInsert>): Promise<TShipmentSelect> => {
    const result = await db.update(shipmentTable)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(shipmentTable.shipmentId, shipmentId))
        .returning();

    if (result.length === 0) {
        throw new Error("Shipment not found");
    }

    return result[0];
}

// Update shipment status (accept job, mark in transit, mark delivered, cancel)
export const updateShipmentStatusServices = async (
    shipmentId: number,
    status: 'open' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled',
    transporterId?: number,
    truckId?: number
): Promise<TShipmentSelect> => {
    const updates: Partial<TShipmentInsert> = { status, updatedAt: new Date() };
    if (transporterId) updates.transporterId = transporterId;
    if (truckId) updates.truckId = truckId;

    const result = await db.update(shipmentTable)
        .set(updates)
        .where(eq(shipmentTable.shipmentId, shipmentId))
        .returning();

    if (result.length === 0) {
        throw new Error("Shipment not found");
    }

    return result[0];
}

// Delete a shipment
export const deleteShipmentServices = async (shipmentId: number): Promise<string> => {
    const result = await db.delete(shipmentTable)
        .where(eq(shipmentTable.shipmentId, shipmentId))
        .returning();

    if (result.length === 0) {
        throw new Error("Shipment not found");
    }

    return "Shipment deleted successfully";
}