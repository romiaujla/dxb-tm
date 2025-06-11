import type { ObjectNameEnum } from "dxb-tm-core";
import { PrismaClient } from "../generated/prisma";
import type { ObjectCreateResponse } from "../models/object-create-response.model";

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

        console.log('Creating object:', objectName, data, userId);

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

            console.log('Created new object:', newObject);

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
}