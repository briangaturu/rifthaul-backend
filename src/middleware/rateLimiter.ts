import { Request, Response, NextFunction } from "express";

// Simple in-memory rate limiter: max requests per IP within a time window
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

interface RateRecord {
    count: number;
    windowStart: number;
}

const requestCounts = new Map<string, RateRecord>();

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    const record = requestCounts.get(ip);

    if (!record || now - record.windowStart > WINDOW_MS) {
        requestCounts.set(ip, { count: 1, windowStart: now });
        next();
        return;
    }

    if (record.count >= MAX_REQUESTS) {
        res.status(429).json({ error: "Too many requests, please try again later" });
        return;
    }

    record.count += 1;
    next();
};