import { InstanceModel, InstanceSchema, ObjectNameEnum } from 'dxb-tm-core';
import { ZodError } from 'zod';
import type { ObjectCreateResponse } from '../models/object-create-response.model';
import type { ObjectGetResponse } from '../models/object-get-response.model';
import type { ObjectUpdateResponse } from '../models/object-update-response.model';
import { ErrorHandlingService } from '../services/error-handling.service';
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
                deletedById: true,
                createdById: true,
                updatedById: true
            }).parse(instance);

            return this._objectService.createObject<InstanceModel>({
                objectName,
                data: parsed,
            });


        } catch (error) {
            if (error instanceof ZodError) {
                return ZodErrorHandlingService.handleZodError({
                    error: error,
                    objectName
                })
            }

            return ErrorHandlingService.get500InternalErrorResponse();
        }
    }

    public async getAll(): Promise<ObjectGetResponse<InstanceModel>> {
        const objectName = ObjectNameEnum.INSTANCE;

        return this._objectService.getAllObjects<InstanceModel>({
            objectName
        });
    }

    public async updateById(id: number, instance: InstanceModel): Promise<ObjectUpdateResponse<InstanceModel>> {
        const objectName = ObjectNameEnum.INSTANCE;
        const PartialInstanceSchema = InstanceSchema.partial();

        try {
            if (instance == null || Object.keys(instance).length === 0) {
                throw new Error('No data provided to update');
            }

            PartialInstanceSchema.parse(instance);

            return this._objectService.updateObject<InstanceModel>({
                objectName,
                id,
                data: instance,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return ZodErrorHandlingService.handleZodError({
                    error: error,
                    objectName
                })
            }

            if (error instanceof Error && error.message === 'No data provided to update') {
                return ErrorHandlingService.get400BadRequestErrorResponse({
                    message: error.message
                });
            }

            return ErrorHandlingService.get500InternalErrorResponse();
        }
    }
}