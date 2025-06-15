import { ResponseModel } from "./response.model";

export interface ResponseDataModel<T> extends ResponseModel {
    body: ResponseModel["body"] & {
        data: T;
    };
}
