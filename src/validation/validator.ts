import { z } from "zod";

// ───────────── User / Auth Validators ─────────────

export const UserValidator = z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    companyName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().optional(),
    userType: z.enum(['business', 'transporter', 'admin']).default('business'),
});

export const UserLoginValidator = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const UserUpdateValidator = z.object({
    fullName: z.string().min(1).optional(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    profileUrl: z.string().optional(),
});

// ───────────── Shipment Validators ─────────────

export const ShipmentValidator = z.object({
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required"),
    cargoType: z.string().min(1, "Cargo type is required"),
    weightTonnes: z.string().or(z.number()).transform(String),
    budget: z.string().or(z.number()).transform(String).optional(),
    pickupDate: z.coerce.date(),
});

export const ShipmentUpdateValidator = z.object({
    origin: z.string().min(1).optional(),
    destination: z.string().min(1).optional(),
    cargoType: z.string().min(1).optional(),
    weightTonnes: z.string().or(z.number()).transform(String).optional(),
    budget: z.string().or(z.number()).transform(String).optional(),
    pickupDate: z.coerce.date().optional(),
});

export const ShipmentStatusValidator = z.object({
    status: z.enum(['open', 'accepted', 'in_transit', 'delivered', 'cancelled']),
    transporterId: z.number().optional(),
    truckId: z.number().optional(),
});

// ───────────── Truck Validators ─────────────

export const TruckValidator = z.object({
    truckType: z.string().min(1, "Truck type is required"),
    plateNumber: z.string().min(1, "Plate number is required"),
    capacityTonnes: z.string().or(z.number()).transform(String),
    location: z.string().optional(),
});

export const TruckUpdateValidator = z.object({
    truckType: z.string().min(1).optional(),
    plateNumber: z.string().min(1).optional(),
    capacityTonnes: z.string().or(z.number()).transform(String).optional(),
    location: z.string().optional(),
});

export const TruckStatusValidator = z.object({
    status: z.enum(['available', 'on_job', 'inactive']),
});