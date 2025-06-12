import type { ObjectNameEnum } from "dxb-tm-core";
import { ZodError, ZodIssue } from "zod";
import type { ResponseModel } from "../models/response.model";

export class ZodErrorHandlingService {
    public static handleZodError(options: { error: ZodError, objectName?: ObjectNameEnum }): ResponseModel {
        const { error, objectName } = options;
        const firstError = error.errors[0];

        const isRequiredError = firstError != null && firstError.message === ZodErrorMessageEnum.REQUIRED;
        const isInvalidType = firstError != null && firstError.code === ZodErrorCodeEnum.INVALID_TYPE;
        const isTooSmall = firstError != null && firstError.code === ZodErrorCodeEnum.TOO_SMALL;
        const isTooBig = firstError != null && firstError.code === ZodErrorCodeEnum.TOO_BIG;
        const isInvalidDate = firstError != null && firstError.code === ZodErrorCodeEnum.INVALID_DATE;

        if (isRequiredError && isInvalidType) {
            return ZodErrorHandlingService._getZodRequiredErrorMessage({
                firstError,
                objectName
            });
        } else if (isInvalidType) {
            return ZodErrorHandlingService._getZodInvalidTypeErrorMessage({
                firstError,
            });
        } else if (isTooSmall) {
            return ZodErrorHandlingService._getZodTooSmallErrorMessage({
                firstError,
            });
        } else if (isTooBig) {
            return ZodErrorHandlingService._getZodTooBigErrorMessage({
                firstError,
            });
        } else if (isInvalidDate) {
            return ZodErrorHandlingService._getZodInvalidDateErrorMessage({
                firstError,
            });
        }
        else {
            return ZodErrorHandlingService._getDefaultErrorResponse(error);
        }
    }

    private static _getDefaultErrorResponse(error: ZodError): ResponseModel {
        return {
            status: 400,
            body: {
                error: error.errors.map(e => e.message).join(', '),
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

    private static _getZodInvalidTypeErrorMessage(options: {
        firstError: ZodIssue,
    }): ResponseModel {
        const { firstError } = options;

        let message = firstError.message;

        if ('expected' in firstError && 'received' in firstError) {
            message = `'${firstError.path[0]}' is expected to be a ${firstError.expected}, but received a ${firstError.received}`;
        }
        return {
            status: 400,
            body: {
                error: 'Invalid Type',
                message,
            }
        };
    }

    private static _getZodTooSmallErrorMessage(options: {
        firstError: ZodIssue,
    }): ResponseModel {
        const { firstError } = options;

        let message = `'${firstError.path[0]}' is too small`;

        if ('minimum' in firstError) {
            message = `'${firstError.path[0]}' is too small, minimum length is ${firstError.minimum}`;
        }

        return {
            status: 400,
            body: {
                error: 'Validation Error',
                message,
            }
        };
    }

    private static _getZodTooBigErrorMessage(options: {
        firstError: ZodIssue,
    }): ResponseModel {
        const { firstError } = options;
        let message = `'${firstError.path[0]}' is too big`;

        if ('maximum' in firstError) {
            message = `'${firstError.path[0]}' is too big, maximum length is ${firstError.maximum}`;
        }

        return {
            status: 400,
            body: {
                error: 'Validation Error',
                message,
            }
        };
    }

    private static _getZodInvalidDateErrorMessage(options: {
        firstError: ZodIssue,
    }): ResponseModel {
        const { firstError } = options;
        return {
            status: 400,
            body: {
                error: 'Validation Error',
                message: `'${firstError.path[0]}' is not a valid date`
            }
        };
    }
}

enum ZodErrorMessageEnum {
    REQUIRED = 'Required',
}

enum ZodErrorCodeEnum {
    INVALID_TYPE = 'invalid_type',
    TOO_SMALL = 'too_small',
    TOO_BIG = 'too_big',
    INVALID_DATE = 'invalid_date',
}