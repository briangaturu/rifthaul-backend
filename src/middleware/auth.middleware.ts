import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
    userId: number;
    email: string;
    userType: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET as string;
        const payload = jwt.verify(token, secret) as AuthPayload;

        req.user = payload;
        next();
    } catch (error: any) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        if (!roles.includes(req.user.userType)) {
            res.status(403).json({ error: "Forbidden: insufficient permissions" });
            return;
        }
        next();
    };
};