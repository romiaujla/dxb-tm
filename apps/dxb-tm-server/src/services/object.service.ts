import bcrypt from "bcryptjs";
import { ObjectNameEnum } from "dxb-tm-core";
import { ObjectDeleteTypeEnum } from "../enums/object-delete-type.enum";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../errors/app.error";
import { Prisma, PrismaClient } from "../generated/prisma";
import type { ObjectCreateResponse } from "../models/object-create-response.model";
import type { ObjectDeleteResponse } from "../models/object-delete-response.model";
import type { ObjectGetResponse } from "../models/object-get-response.model";
import type { ObjectUpdateResponse } from "../models/object-update-response.model";
import type { ResponseModel } from "../models/response.model";

export class ObjectService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createObject<T>(options: {
        objectName: ObjectNameEnum;
        data: Partial<T>;
        userId?: number;
    }): Promise<ObjectCreateResponse<T>> {
        const { objectName, data, userId } = options;

        try {
            const modelDelegate = (this.prisma as any)[objectName];

            if (objectName === ObjectNameEnum.USER) {
                if (
                    "password" in data &&
                    typeof data.password === "string" &&
                    data.password != null
                ) {
                    data.password = await bcrypt.hash(data.password, 10);
                }
            }

            const newObject = (await modelDelegate.create({
                data: {
                    ...data,
                    createdById: userId ?? 0,
                    updatedById: userId ?? 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            })) as T;

            return {
                status: 200,
                body: {
                    message: `${objectName} created successfully`,
                    data: newObject,
                },
            };
        } catch (err) {
            console.error(err);
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestError(err.message);
            }

            throw new InternalServerError("An unexpected error occurred");
        }
    }

    public async getAllObjects<T>(options: {
        objectName: ObjectNameEnum;
    }): Promise<ObjectGetResponse<T>> {
        const { objectName } = options;

        const modelDelegate = (this.prisma as any)[objectName];

        const allObjects = (await modelDelegate.findMany()) as Array<T>;

        return {
            status: 200,
            body: {
                message: `${objectName} fetched successfully`,
                data: allObjects,
            },
        };
    }

    public async getObjectById<T>(options: {
        objectName: ObjectNameEnum;
        id: number;
        getDeleted?: boolean;
    }): Promise<ObjectGetResponse<T>> {
        const { objectName, id, getDeleted = false } = options;

        try {
            const modelDelegate = (this.prisma as any)[objectName];

            const where = getDeleted ? { id } : { id, deletedById: null };

            const object = (await modelDelegate.findUnique({
                where,
            })) as T;

            if (object == null) {
                throw new NotFoundError(
                    `Object: ${objectName} with id ${id} not found`,
                );
            }

            return {
                status: 200,
                body: {
                    message: `${objectName} fetched successfully`,
                    data: [object],
                },
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new NotFoundError(
                    `Object: ${error.meta?.model} with id ${id} not found`,
                );
            }

            throw new InternalServerError("An unexpected error occurred");
        }
    }

    public async updateObject<T>(options: {
        objectName: ObjectNameEnum;
        id: number;
        data: Partial<T>;
        userId?: number;
    }): Promise<ObjectUpdateResponse<T>> {
        const { objectName, id, data, userId = 0 } = options;

        const modelDelegate = (this.prisma as any)[objectName];

        try {
            const updatedObject = (await modelDelegate.update({
                where: { id },
                data: {
                    ...data,
                    updatedById: userId,
                    updatedAt: new Date().toISOString(),
                },
            })) as T;

            return {
                status: 200,
                body: {
                    message: `${objectName} updated successfully`,
                    data: updatedObject,
                },
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new NotFoundError(
                    `Object: ${error.meta?.model} with id ${id} not found`,
                );
            }

            throw new InternalServerError("An unexpected error occurred");
        }
    }

    public async deleteObjectById(options: {
        objectName: ObjectNameEnum;
        id: number;
        userId?: number;
        deleteType?: ObjectDeleteTypeEnum;
    }): Promise<ObjectDeleteResponse | ResponseModel> {
        const {
            objectName,
            id,
            userId = 0,
            deleteType = ObjectDeleteTypeEnum.SOFT,
        } = options;

        const modelDelegate = (this.prisma as any)[objectName];

        try {
            if (deleteType === ObjectDeleteTypeEnum.SOFT) {
                const object = await modelDelegate.findUnique({
                    where: {
                        id,
                        deletedById: null,
                    },
                });

                if (object != null) {
                    await modelDelegate.update({
                        where: { id },
                        data: {
                            deletedAt: new Date().toISOString(),
                            deletedById: userId,
                            updatedById: userId,
                            updatedAt: new Date().toISOString(),
                        },
                    });
                } else {
                    return {
                        status: 400,
                        body: {
                            message: `Object: ${objectName} with id: ${id} not found`,
                            error: "Object not found",
                        },
                    };
                }
            } else {
                await modelDelegate.delete({
                    where: { id },
                });
            }

            return {
                status: 200,
                body: {
                    message: `Object: ${objectName} with id: ${id} was deleted successfully`,
                    deleted: true,
                    type: deleteType,
                },
            };
        } catch (error) {
            throw new InternalServerError("An unexpected error occurred");
        }
    }

    public async getObjectByQuery<T, TQuery>(options: {
        objectName: ObjectNameEnum;
        query: TQuery;
    }): Promise<ObjectGetResponse<T>> {
        const { objectName, query } = options;

        const modelDelegate = (this.prisma as any)[objectName];

        const objects = (await modelDelegate.findMany({
            where: query,
        })) as Array<T>;

        return {
            status: 200,
            body: {
                message: `${objectName} fetched successfully`,
                data: objects,
            },
        };
    }
}
