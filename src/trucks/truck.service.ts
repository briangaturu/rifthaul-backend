import { eq, and, ilike } from "drizzle-orm";
import db from "../drizzle/db";
import { TTruckInsert, TTruckSelect, truckTable } from "../drizzle/schema";

// Create a truck listing
export const createTruckServices = async (truck: TTruckInsert): Promise<TTruckSelect> => {
    const result = await db.insert(truckTable).values(truck).returning();
    return result[0];
}

// Get all trucks (optionally filter by status/location)
export const getAllTrucksServices = async (location?: string): Promise<TTruckSelect[]> => {
    if (location) {
        return await db.query.truckTable.findMany({
            where: ilike(truckTable.location, `%${location}%`)
        });
    }
    return await db.query.truckTable.findMany();
}

// Get truck by id
export const getTruckByIdServices = async (truckId: number): Promise<TTruckSelect | undefined> => {
    return await db.query.truckTable.findFirst({
        where: eq(truckTable.truckId, truckId)
    })
}

// Get all trucks belonging to a transporter
export const getTrucksByTransporterServices = async (transporterId: number): Promise<TTruckSelect[]> => {
    return await db.query.truckTable.findMany({
        where: eq(truckTable.transporterId, transporterId)
    })
}

// Update truck details
export const updateTruckServices = async (truckId: number, updates: Partial<TTruckInsert>): Promise<TTruckSelect> => {
    const result = await db.update(truckTable)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(truckTable.truckId, truckId))
        .returning();

    if (result.length === 0) {
        throw new Error("Truck not found");
    }

    return result[0];
}

// Update truck status only
export const updateTruckStatusServices = async (truckId: number, status: 'available' | 'on_job' | 'inactive'): Promise<TTruckSelect> => {
    const result = await db.update(truckTable)
        .set({ status, updatedAt: new Date() })
        .where(eq(truckTable.truckId, truckId))
        .returning();

    if (result.length === 0) {
        throw new Error("Truck not found");
    }

    return result[0];
}

// Delete a truck listing
export const deleteTruckServices = async (truckId: number): Promise<string> => {
    const result = await db.delete(truckTable)
        .where(eq(truckTable.truckId, truckId))
        .returning();

    if (result.length === 0) {
        throw new Error("Truck not found");
    }

    return "Truck deleted successfully";
}