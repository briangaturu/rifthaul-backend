import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, integer, varchar, pgEnum, decimal, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("userType", ['business', 'transporter', 'admin']);
export const shipmentStatusEnum = pgEnum("shipmentStatus", ['open', 'accepted', 'in_transit', 'delivered', 'cancelled']);
export const truckStatusEnum = pgEnum("truckStatus", ['available', 'on_job', 'inactive']);

// User table
export const userTable = pgTable("userTable", {
    userId: serial("userId").primaryKey(),
    fullName: varchar("fullName"),
    companyName: varchar("companyName"),
    profileUrl: varchar("profileUrl").default("null"),
    email: varchar("email").notNull(),
    password: varchar("password").notNull(),
    phone: varchar("phone"),
    userType: roleEnum("userType").default('business'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});

// Truck table
export const truckTable = pgTable("truckTable", {
    truckId: serial("truckId").primaryKey(),
    transporterId: integer("transporterId").notNull().references(() => userTable.userId, { onDelete: 'cascade' }),
    truckType: varchar("truckType").notNull(),
    plateNumber: varchar("plateNumber").notNull(),
    capacityTonnes: decimal("capacityTonnes").notNull(),
    location: varchar("location"),
    status: truckStatusEnum("truckStatus").default('available'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});

// Shipment table
export const shipmentTable = pgTable("shipmentTable", {
    shipmentId: serial("shipmentId").primaryKey(),
    businessId: integer("businessId").notNull().references(() => userTable.userId, { onDelete: 'cascade' }),
    transporterId: integer("transporterId").references(() => userTable.userId, { onDelete: 'set null' }),
    truckId: integer("truckId").references(() => truckTable.truckId, { onDelete: 'set null' }),
    origin: varchar("origin").notNull(),
    destination: varchar("destination").notNull(),
    cargoType: varchar("cargoType").notNull(),
    weightTonnes: decimal("weightTonnes").notNull(),
    budget: decimal("budget"),
    pickupDate: timestamp("pickupDate").notNull(),
    status: shipmentStatusEnum("shipmentStatus").default('open'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});

// Infer Types
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TTruckInsert = typeof truckTable.$inferInsert;
export type TTruckSelect = typeof truckTable.$inferSelect;

export type TShipmentInsert = typeof shipmentTable.$inferInsert;
export type TShipmentSelect = typeof shipmentTable.$inferSelect;

// Relations
// user(1) --> (m)trucks
export const userTrucksRelation = relations(userTable, ({ many }) => ({
    trucks: many(truckTable),
}));

// truck(1) --> (1)transporter
export const truckTransporterRelation = relations(truckTable, ({ one }) => ({
    transporter: one(userTable, {
        fields: [truckTable.transporterId],
        references: [userTable.userId],
    }),
}));

// shipment(1) --> (1)business, (1)transporter, (1)truck
export const shipmentRelations = relations(shipmentTable, ({ one }) => ({
    business: one(userTable, {
        fields: [shipmentTable.businessId],
        references: [userTable.userId],
    }),
    transporter: one(userTable, {
        fields: [shipmentTable.transporterId],
        references: [userTable.userId],
    }),
    truck: one(truckTable, {
        fields: [shipmentTable.truckId],
        references: [truckTable.truckId],
    }),
}));

// user(1) --> (m)shipments as business
export const userShipmentsRelation = relations(userTable, ({ many }) => ({
    shipments: many(shipmentTable),
}));

// truck(1) --> (m)shipments
export const truckShipmentsRelation = relations(truckTable, ({ many }) => ({
    shipments: many(shipmentTable),
}));