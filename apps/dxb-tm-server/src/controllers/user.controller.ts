import { ObjectNameEnum, type UserModel } from "dxb-tm-core";
import type { ObjectGetResponse } from "../models/object-get-response.model";
import { ObjectService } from "../services/object.service";

export class UserController {
    private _objectService: ObjectService;

    constructor() {
        this._objectService = new ObjectService();
    }

    public async getById(options: {
        id: number,
        getDeleted?: boolean
    }): Promise<ObjectGetResponse<UserModel>> {
        const { id, getDeleted = false } = options;
        const objectName = ObjectNameEnum.INSTANCE;

        return this._objectService.getObjectById<UserModel>({
            objectName,
            id,
            getDeleted
        });
    }
}