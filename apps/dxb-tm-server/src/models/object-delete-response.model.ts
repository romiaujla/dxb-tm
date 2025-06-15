import type { ObjectDeleteTypeEnum } from "../enums/object-delete-type.enum";
import type { ResponseModel } from "./response.model";

export interface ObjectDeleteResponse extends ResponseModel {
  body: ResponseModel["body"] & {
    deleted: boolean;
    type: ObjectDeleteTypeEnum;
  };
}
