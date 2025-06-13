import type { ResponseModel } from "./response.model";

export interface ObjectCreateResponse<T> extends ResponseModel {
    body: ResponseModel['body'] & {
        data?: T;
    };
}