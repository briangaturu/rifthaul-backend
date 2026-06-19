CREATE TYPE "public"."userType" AS ENUM('business', 'transporter', 'admin');--> statement-breakpoint
CREATE TYPE "public"."shipmentStatus" AS ENUM('open', 'accepted', 'in_transit', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."truckStatus" AS ENUM('available', 'on_job', 'inactive');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipmentTable" (
	"shipmentId" serial PRIMARY KEY NOT NULL,
	"businessId" integer NOT NULL,
	"transporterId" integer,
	"truckId" integer,
	"origin" varchar NOT NULL,
	"destination" varchar NOT NULL,
	"cargoType" varchar NOT NULL,
	"weightTonnes" numeric NOT NULL,
	"budget" numeric,
	"pickupDate" timestamp NOT NULL,
	"shipmentStatus" "shipmentStatus" DEFAULT 'open',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "truckTable" (
	"truckId" serial PRIMARY KEY NOT NULL,
	"transporterId" integer NOT NULL,
	"truckType" varchar NOT NULL,
	"plateNumber" varchar NOT NULL,
	"capacityTonnes" numeric NOT NULL,
	"location" varchar,
	"truckStatus" "truckStatus" DEFAULT 'available',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userTable" (
	"userId" serial PRIMARY KEY NOT NULL,
	"fullName" varchar,
	"companyName" varchar,
	"profileUrl" varchar DEFAULT 'null',
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"phone" varchar,
	"userType" "userType" DEFAULT 'business',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipmentTable" ADD CONSTRAINT "shipmentTable_businessId_userTable_userId_fk" FOREIGN KEY ("businessId") REFERENCES "public"."userTable"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipmentTable" ADD CONSTRAINT "shipmentTable_transporterId_userTable_userId_fk" FOREIGN KEY ("transporterId") REFERENCES "public"."userTable"("userId") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipmentTable" ADD CONSTRAINT "shipmentTable_truckId_truckTable_truckId_fk" FOREIGN KEY ("truckId") REFERENCES "public"."truckTable"("truckId") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "truckTable" ADD CONSTRAINT "truckTable_transporterId_userTable_userId_fk" FOREIGN KEY ("transporterId") REFERENCES "public"."userTable"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
