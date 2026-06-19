import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema";

// Get user by id
export const getUserByIdServices = async (userId: number): Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.userId, userId)
    })
}

// Get all transporters
export const getAllTransportersServices = async (): Promise<TUserSelect[]> => {
    return await db.query.userTable.findMany({
        where: eq(userTable.userType, 'transporter')
    })
}

// Get all businesses
export const getAllBusinessesServices = async (): Promise<TUserSelect[]> => {
    return await db.query.userTable.findMany({
        where: eq(userTable.userType, 'business')
    })
}

// Update user profile
export const updateUserServices = async (userId: number, updates: Partial<TUserInsert>): Promise<TUserSelect> => {
    const result = await db.update(userTable)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userTable.userId, userId))
        .returning();

    if (result.length === 0) {
        throw new Error("User not found");
    }

    return result[0];
}

// Delete user
export const deleteUserServices = async (userId: number): Promise<string> => {
    const result = await db.delete(userTable)
        .where(eq(userTable.userId, userId))
        .returning();

    if (result.length === 0) {
        throw new Error("User not found");
    }

    return "User deleted successfully";
}