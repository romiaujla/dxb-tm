import type { ResponseModel } from "./response.model";

export interface ObjectUpdateResponse<T> extends ResponseModel {
    body: ResponseModel['body'] & {
        data?: T;
    };
}