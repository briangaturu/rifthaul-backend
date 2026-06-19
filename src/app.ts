import express, { Application, Request, Response } from "express";

import { authRouter } from "./auth/auth.route";
import { userRouter } from "./users/user.route";
import { truckRouter } from "./trucks/truck.route";
import { shipmentRouter } from "./shipment/shipment.route";
import { rateLimiterMiddleware } from "./middleware/rateLimiter";
import cors from "cors";

const app: Application = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Simple logger middleware
const logger = (req: Request, res: Response, next: Function) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
app.use(logger);
app.use(rateLimiterMiddleware);

// default
app.get('/', (req: Request, res: Response) => {
    res.send("Rift Haul API is running 🚛");
});

// import routes
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', truckRouter);
app.use('/api', shipmentRouter);

export default app;