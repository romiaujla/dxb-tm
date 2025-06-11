import { InstanceModel, InstanceSchema } from 'dxb-tm-core/src';
import { ObjectNameEnum } from 'dxb-tm-core/src/core/enums';
import { ZodError } from 'zod';
import type { ObjectCreateResponse } from '../models/object-create-response.model';
import { ObjectService } from '../services/object.service';

export class InstanceController {
    private _objectService: ObjectService;

    constructor() {
        this._objectService = new ObjectService();
    }


    public async create(instance: InstanceModel, objectName: ObjectNameEnum): Promise<ObjectCreateResponse<InstanceModel>> {
        console.log('Creating instance:', instance);

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


        } catch (err) {
            if (err instanceof ZodError) {
                return {
                    status: 400,
                    body: {
                        message: 'Validation error',
                        error: err.errors.map(e => e.message).join(', ')
                    }
                };
            }

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