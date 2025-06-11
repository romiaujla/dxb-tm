import type { ObjectNameEnum } from "dxb-tm-core/src/core/enums";
import type { ObjectCreateResponse } from "../models/object-create-response.model";
import prisma from "../prisma/client";

export class ObjectService {
    public async createObject<T>(options: {
        objectName: ObjectNameEnum;
        data: Partial<T>;
        userId?: number;
    }): Promise<ObjectCreateResponse<T>> {
        const { objectName, data, userId } = options;

        try {
            const newObject = await prisma[objectName].create({
                data: {
                    ...data,
                    createdBy: userId ?? 0,
                    updatedBy: userId ?? 0,
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