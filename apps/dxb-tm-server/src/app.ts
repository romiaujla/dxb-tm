import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import { AppError } from "./errors/app.error";
import { authMiddleware } from "./middleware/auth.middleware";
import authRoutes from "./routes/auth.routes";
import instanceRoutes from "./routes/instance.routes";
import userRoutes from "./routes/user.routes";

export class App {
    private _app: Application;

    constructor() {
        this._app = express();
        this._configureMiddleware();
        this._configureRoutes();
        this._configureErrorHandling();
    }

    private _configureMiddleware() {
        console.log("Configuring middleware...");
        this._app.use(express.json());
    }

    private _configureRoutes() {
        console.log("Configuring routes...");
        this._app.use("/auth", authRoutes);
        this._app.use("/instance", authMiddleware, instanceRoutes);
        this._app.use("/user", authMiddleware, userRoutes);
    }

    private _configureErrorHandling() {
        console.log("Configuring error handling...");
        this._app.use(
            (err: Error, _req: Request, res: Response, _next: NextFunction) => {
                if (err instanceof AppError) {
                    res.status(err.statusCode).json({
                        message: err.message,
                        error: err.error,
                        stack: err.stack?.split("\n"),
                    });
                }
            },
        );

        this._app.use((_req: Request, _res: Response) => {
            _res.status(404).send();
        });

        this._app.use(
            (err: Error, _req: Request, res: Response, _next: NextFunction) => {
                res.status(500).json({
                    message: "Internal Server Error",
                    error: err.message,
                    stack: err.stack?.split("\n"),
                });
            },
        );
    }

    public listen(port: number | string) {
        this._app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}...`);
        });
    }

    public getServer(): Application {
        return this._app;
    }
}
