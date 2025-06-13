import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import instanceRoutes from "./routes/instance.routes";
import { ErrorHandlingService } from "./services/error-handling.service";

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this._configureMiddleware();
        this._configureRoutes();
        this._configureErrorHandling();
    }

    private _configureMiddleware() {
        console.log('Configuring middleware');
        this.app.use(express.json());
    }

    private _configureRoutes() {
        console.log('Configuring routes');
        this.app.use('/instance', instanceRoutes);
    }

    private _configureErrorHandling() {
        console.log('Configuring error handling');
        this.app.use((_req: Request, _res: Response,) => {
            _res.status(404).send();
        });

        this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
            const response = ErrorHandlingService.get500InternalErrorResponse(err);
            res.status(response.status).json(response.body);
        });
    }

    public listen(port: number | string) {
        this.app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }

    public getServer(): Application {
        return this.app;
    }

}