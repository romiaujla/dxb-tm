import bcrypt from "bcryptjs";
import { ObjectNameEnum, type RoleModel, type UserModel, type UserRoleModel } from "dxb-tm-core";
import { BadRequestError, UnauthorizedError } from "../errors/app.error";
import type { Prisma } from "../generated/prisma";
import type { ResponseDataModel } from "../models/response-data.model";
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
        ResponseDataModel<{
            user: LoggedInUserModel;
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
            await this._objectService.getObjectByQueryWithSelectedFields<
                LoggedInUserModel,
                Prisma.UserWhereInput
            >({
                objectName: ObjectNameEnum.USER,
                query: {
                    email,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    active: true,
                    password: true,
                    userRoles: {
                        select: {
                            fkUserId: true,
                            fkRoleId: true,
                            role: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    }
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

        const { accessToken, refreshToken } =
            await this._jwtService.generateToken({
                email: user.email,
                id: user.id,
            });

        return {
            status: 200,
            body: {
                message: "Login successful",
                data: {
                    user,
                    accessToken,
                    refreshToken,
                },
            },
        };
    }

    public async handleValidate(request: {
        cookies: { token?: string };
    }): Promise<
        ResponseDataModel<{
            email: string;
            id: string;
        }>
    > {
        const decoded = this._jwtService.verifyToken(request);

        if (decoded == null) {
            throw new UnauthorizedError("Invalid token");
        }

        return {
            status: 200,
            body: {
                message: "Token is valid",
                data: decoded,
            },
        };
    }
}


interface LoggedInUserModel extends Pick<UserModel, "id" | "email" | "firstName" | "lastName" | "active" | 'password'> {
    userRoles: Array<Pick<UserRoleModel, "fkUserId" | "fkRoleId"> & {
        role: Pick<RoleModel, "name">;
    }>
}