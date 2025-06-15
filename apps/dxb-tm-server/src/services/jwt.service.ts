import type { UserModel } from "dxb-tm-core";
import type { NextFunction } from "express";
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
    console.log("secret", this._jwtSecret);
    console.log("refresh secret", this._jwtRefreshSecret);

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

  public verifyToken(request: Request, next: NextFunction) {
    const authHeader = request.headers.get("authorization");

    if (authHeader == null) {
      throw new UnauthorizedError();
    }

    const token = authHeader.split(" ")[1];

    if (token == null) {
      throw new UnauthorizedError();
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        throw new UnauthorizedError();
      }

      // @ts-ignore
      request.user = decoded;
      next();
    });
  }
}
