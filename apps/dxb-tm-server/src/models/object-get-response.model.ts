import type { ResponseModel } from "./response.model";

export interface ObjectGetResponse<T> extends ResponseModel {
  body: ResponseModel["body"] & {
    data?: Array<T>;
  };
}
