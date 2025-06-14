import bcrypt from "bcryptjs";
import { ObjectNameEnum, type UserModel } from "dxb-tm-core";
import { BadRequestError, UnauthorizedError } from "../errors/app.error";
import type { Prisma } from "../generated/prisma";
import type { ObjectUpdateResponse } from "../models";
import { JwtService } from "../services/jwt.service";
import { ObjectService } from "../services/object.service";

export class AuthController {
  private _objectService: ObjectService;
  private _jwtService: JwtService;

  constructor() {
    this._objectService = new ObjectService();
    this._jwtService = new JwtService();
  }

  public async handleLogin(request: {
    body: { email: string; password: string };
  }): Promise<
    ObjectUpdateResponse<{
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const { email, password } = request.body;

    if (email == null) {
      throw new BadRequestError("Email is required");
    }

    if (password == null) {
      throw new BadRequestError("Password is required");
    }

    const user = (
      await this._objectService.getObjectByQuery<
        UserModel,
        Prisma.UserWhereInput
      >({
        objectName: ObjectNameEnum.USER,
        query: {
          email,
        },
      })
    ).body.data?.[0];

    if (user == null) {
      throw new UnauthorizedError("The email address is not registered");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("The password is incorrect");
    }

    const { accessToken, refreshToken } = await this._jwtService.generateToken({
      email: user.email,
      id: user.id,
    });

    return {
      status: 200,
      body: {
        message: "Login successful",
        data: {
          accessToken,
          refreshToken,
        },
      },
    };
  }
}
