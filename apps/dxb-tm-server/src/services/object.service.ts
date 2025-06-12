import type { ObjectNameEnum } from "dxb-tm-core";
import { ObjectDeleteTypeEnum } from "../enums/object-delete-type.enum";
import { Prisma, PrismaClient } from "../generated/prisma";
import type { ObjectCreateResponse } from "../models/object-create-response.model";
import type { ObjectDeleteResponse } from "../models/object-delete-response.model";
import type { ObjectGetResponse } from "../models/object-get-response.model";
import type { ObjectUpdateResponse } from "../models/object-update-response.model";
import type { ResponseModel } from "../models/response.model";
import { ErrorHandlingService } from "./error-handling.service";

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

            const newObject = await modelDelegate.create({
                data: {
                    ...data,
                    createdById: userId ?? 0,
                    updatedById: userId ?? 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            }) as T;

            return {
                status: 200,
                body: {
                    message: `${objectName} created successfully`,
                    data: newObject
                }
            };
        } catch (err) {
            console.error(err);
            return {
                status: 500,
                body: {
                    message: 'Internal server error',
                    error: 'An unexpected error occurred'
                }
            };
        }
    }

    public async getAllObjects<T>(options: {
        objectName: ObjectNameEnum;
    }): Promise<ObjectGetResponse<T>> {
        const { objectName } = options;

        const modelDelegate = (this.prisma as any)[objectName];

        const allObjects = await modelDelegate.findMany() as Array<T>;

        return {
            status: 200,
            body: {
                message: `${objectName} fetched successfully`,
                data: allObjects
            }
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

            const object = await modelDelegate.findUnique({
                where
            }) as T;

            return {
                status: 200,
                body: {
                    message: `${objectName} fetched successfully`,
                    data: [object]
                }
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return {
                    status: 400,
                    body: {
                        message: `Object: ${error.meta?.model} with id ${id} not found`,
                        error: error.message,
                        stack: error.stack?.split('\n')
                    }
                }
            }

            return ErrorHandlingService.get500InternalErrorResponse(error);
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
            const updatedObject = await modelDelegate.update({
                where: { id },
                data: {
                    ...data,
                    updatedById: userId,
                    updatedAt: new Date().toISOString()
                }
            }) as T;

            return {
                status: 200,
                body: {
                    message: `${objectName} updated successfully`,
                    data: updatedObject
                }
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return {
                    status: 400,
                    body: {
                        message: `Object: ${error.meta?.model} with id ${id} not found`,
                        error: error.message,
                        stack: error.stack?.split('\n')
                    }
                }
            }

            return ErrorHandlingService.get500InternalErrorResponse(error);
        }
    }

    public async deleteObjectById(
        options: {
            objectName: ObjectNameEnum;
            id: number;
            userId?: number;
            deleteType?: ObjectDeleteTypeEnum;
        }
    ): Promise<ObjectDeleteResponse | ResponseModel> {
        const { objectName, id, userId = 0, deleteType = ObjectDeleteTypeEnum.SOFT } = options;

        const modelDelegate = (this.prisma as any)[objectName];

        try {
            if (deleteType === ObjectDeleteTypeEnum.SOFT) {
                const object = await modelDelegate.findUnique({
                    where: {
                        id,
                        deletedById: null
                    }
                });

                if (object != null) {
                    await modelDelegate.update({
                        where: { id },
                        data: {
                            deletedAt: new Date().toISOString(),
                            deletedById: userId,
                            updatedById: userId,
                            updatedAt: new Date().toISOString(),
                        }
                    })
                } else {
                    return {
                        status: 400,
                        body: {
                            message: `Object: ${objectName} with id: ${id} not found`,
                            error: 'Object not found',
                        }
                    }
                }
            } else {
                await modelDelegate.delete({
                    where: { id }
                })
            }


            return {
                status: 200,
                body: {
                    message: `Object: ${objectName} with id: ${id} was deleted successfully`,
                    deleted: true,
                    type: deleteType
                }
            }
        } catch (error) {
            return ErrorHandlingService.get500InternalErrorResponse(error);
        }
    }
}