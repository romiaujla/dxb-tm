import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import instanceRoutes from "./routes/instance.routes";

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this._configureMiddleware();
        this._configureRoutes();
        this.configureErrorHandling();
    }

    private _configureMiddleware() {
        console.log('Configuring middleware');
        console.log('WARNING: Logging sensitive database URL - Remove in production');
        console.log('env', process.env.DATABASE_URL)
        this.app.use(express.json());

        /**
         * Could benefit from additional common middlewares in the future
         * - CORS
         * - Rate limiting
         * - Request logging
         * - Security headers
         */
    }

    private _configureRoutes() {
        console.log('Configuring routes');
        this.app.use('/instance', instanceRoutes);
    }

    private configureErrorHandling() {
        console.log('Configuring error handling');
        this.app.use((_req: Request, _res: Response) => {
            _res.status(404).send();
        });

        this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
            console.error(err);
            res.status(500).send();
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