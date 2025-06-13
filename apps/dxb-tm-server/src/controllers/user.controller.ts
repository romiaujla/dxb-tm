import { ObjectNameEnum, UserSchema, type UserModel } from "dxb-tm-core";
import { ZodError } from "zod";
import { ObjectDeleteTypeEnum } from "../enums/object-delete-type.enum";
import type { ObjectCreateResponse } from "../models/object-create-response.model";
import type { ObjectDeleteResponse } from "../models/object-delete-response.model";
import type { ObjectGetResponse } from "../models/object-get-response.model";
import type { ResponseModel } from "../models/response.model";
import { ErrorHandlingService } from "../services/error-handling.service";
import { ObjectService } from "../services/object.service";
import { ZodErrorHandlingService } from "../services/zod-error-handling.service";

export class UserController {
  private _objectService: ObjectService;

  constructor() {
    this._objectService = new ObjectService();
  }

  public async getById(options: {
    id: number;
    getDeleted?: boolean;
  }): Promise<ObjectGetResponse<UserModel>> {
    const { id, getDeleted = false } = options;
    const objectName = ObjectNameEnum.USER;

    return this._objectService.getObjectById<UserModel>({
      objectName,
      id,
      getDeleted,
    });
  }

  public async create(
    user: UserModel,
  ): Promise<ObjectCreateResponse<UserModel>> {
    const objectName = ObjectNameEnum.USER;

    try {
      const parsed = UserSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        deletedById: true,
        createdById: true,
        updatedById: true,
      }).parse(user);

      return this._objectService.createObject<UserModel>({
        objectName,
        data: parsed,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return ZodErrorHandlingService.handleZodError({
          error: error,
          objectName,
        });
      }

      return ErrorHandlingService.get500InternalErrorResponse(error);
    }
  }

  public async deleteById(options: {
    id: number;
    deleteType?: ObjectDeleteTypeEnum;
  }): Promise<ObjectDeleteResponse | ResponseModel> {
    const { id, deleteType = ObjectDeleteTypeEnum.SOFT } = options;
    const objectName = ObjectNameEnum.USER;

    return this._objectService.deleteObjectById({
      objectName,
      id,
      deleteType,
    });
  }
}
