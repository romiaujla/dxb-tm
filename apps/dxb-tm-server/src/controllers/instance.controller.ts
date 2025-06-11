import { InstanceModel, InstanceSchema, ObjectNameEnum } from 'dxb-tm-core';
import { ZodError } from 'zod';
import type { ObjectCreateResponse } from '../models/object-create-response.model';
import { ObjectService } from '../services/object.service';
import { ZodErrorHandlingService } from '../services/zod-error-handling.service';

export class InstanceController {
    private _objectService: ObjectService;

    constructor() {
        this._objectService = new ObjectService();
    }


    public async create(instance: InstanceModel): Promise<ObjectCreateResponse<InstanceModel>> {
        const objectName = ObjectNameEnum.INSTANCE;

        try {
            const parsed = InstanceSchema.omit({
                id: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                deletedBy: true,
                createdBy: true,
                updatedBy: true
            }).parse(instance);

            console.log('Parsed instance:', parsed);

            return this._objectService.createObject<InstanceModel>({
                objectName,
                data: parsed,
            });


        } catch (error) {
            if (error instanceof ZodError) {
                ZodErrorHandlingService.handleZodError({
                    error: error,
                    objectName
                })
            }

            console.error(error);
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