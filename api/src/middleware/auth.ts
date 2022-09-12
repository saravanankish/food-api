import { NextFunction, Request, Response } from "express";
import { User } from "../types";

export const auth = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (req.isAuthenticated()) {
            if (req.user) {
                const user: User = req.user as User
                if (user.role !== role) {
                    res.status(403).send({ success: false, message: "Access forbidden" })
                } else {
                    next()
                }
            } else {
                res.status(401).send({ success: false, message: "Unauthenticated" })
            }
        } else {
            res.status(401).send({ success: false, message: "Unauthenticated" })
        }
    }
}
