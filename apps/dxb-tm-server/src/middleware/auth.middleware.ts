import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/app.error";

export const authMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const token = request.cookies.token;

        if (token == null) {
            throw new UnauthorizedError("Unauthorized: No token provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        // @ts-ignore
        request.user = decoded;

        next();
    } catch (error) {
        response.clearCookie("token");
        throw new UnauthorizedError("Unauthorized: Invalid token");
    }
};
