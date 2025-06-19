import type { UserModel } from "dxb-tm-core";
import jwt from "jsonwebtoken";
import { InternalServerError, UnauthorizedError } from "../errors/app.error";

export class JwtService {
    private _jwtSecret: string;
    private _jwtRefreshSecret: string;

    constructor() {
        this._jwtSecret = process.env.JWT_SECRET ?? "";
        this._jwtRefreshSecret = process.env.JWT_REFRESH_SECRET ?? "";
    }

    public async generateToken(payload: {
        email: UserModel["email"];
        id: UserModel["id"];
    }): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const accessToken = jwt.sign(payload, this._jwtSecret, {
                expiresIn: "1h",
            });
            const refreshToken = jwt.sign(payload, this._jwtRefreshSecret, {
                expiresIn: "7d",
            });

            return { accessToken, refreshToken };
        } catch (error) {
            throw new InternalServerError("Unable to generate tokens");
        }
    }

    public verifyToken(request: { cookies: { token?: string } }): {
        email: string;
        id: string;
    } {
        const token = request.cookies.token;

        if (token == null) {
            throw new UnauthorizedError();
        }

        const decoded = jwt.verify(token, this._jwtSecret, (err, decoded) => {
            if (err) {
                throw new UnauthorizedError();
            }

            return decoded;
        });

        return decoded as unknown as {
            email: string;
            id: string;
        };
    }
}
