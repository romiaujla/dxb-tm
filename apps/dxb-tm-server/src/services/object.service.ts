import type { ObjectNameEnum } from "dxb-tm-core";
import { PrismaClient } from "../generated/prisma";
import type { ObjectCreateResponse } from "../models/object-create-response.model";
import type { ObjectGetResponse } from "../models/object-get-response.model";
import type { ObjectUpdateResponse } from "../models/object-update-response.model";

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

    public async updateObject<T>(options: {
        objectName: ObjectNameEnum;
        id: number;
        data: Partial<T>;
        userId?: number;
    }): Promise<ObjectUpdateResponse<T>> {
        const { objectName, id, data, userId = 0 } = options;

        const modelDelegate = (this.prisma as any)[objectName];

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
    }
}