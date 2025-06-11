import type { ObjectNameEnum } from "dxb-tm-core";
import { ZodError, ZodIssue } from "zod";
import type { ResponseModel } from "../models/response.model";

export class ZodErrorHandlingService {
    public static handleZodError(options: { error: ZodError, objectName?: ObjectNameEnum }): ResponseModel {
        const { error, objectName } = options;
        const firstError = error.errors[0];

        if (firstError != null && firstError.message === ZodErrorMessageEnum.REQUIRED) {
            return ZodErrorHandlingService._getZodRequiredErrorMessage({
                firstError,
                objectName
            });
        } else {
            return ZodErrorHandlingService._getDefaultErrorResponse(error);
        }
    }

    private static _getDefaultErrorResponse(err: ZodError): ResponseModel {
        return {
            status: 400,
            body: {
                error: err.errors.map(e => e.message).join(', '),
                message: 'Validation error'
            }
        };
    }



    private static _getZodRequiredErrorMessage(options: {
        firstError: ZodIssue,
        objectName?: ObjectNameEnum
    }): ResponseModel {
        const { firstError, objectName = 'Unknown Object' } = options;
        return {
            status: 400,
            body: {
                error: 'Validation Error',
                message: `'${firstError.path[0]}' is a required field on the '${objectName}' table`
            }
        };
    }
}

enum ZodErrorMessageEnum {
    REQUIRED = 'Required',
}