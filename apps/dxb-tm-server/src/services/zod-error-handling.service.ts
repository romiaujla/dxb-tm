import type { ObjectNameEnum } from "dxb-tm-core";
import { ZodError, ZodIssue } from "zod";
import type { ResponseModel } from "../models/response.model";

export class ZodErrorHandlingService {
    public static handleZodError(options: { error: ZodError, objectName?: ObjectNameEnum }): ResponseModel {
        const { error, objectName } = options;
        const firstError = error.errors[0];

        console.log('First error: ', firstError);

        const isRequiredError = firstError != null && firstError.message === ZodErrorMessageEnum.REQUIRED;
        const isExpectedStringReceivedNumber = firstError != null && firstError.message === ZodErrorMessageEnum.EXPECTED_STRING_RECEIVED_NUMBER;

        if (isRequiredError) {
            return ZodErrorHandlingService._getZodRequiredErrorMessage({
                firstError,
                objectName
            });
        } else if (isExpectedStringReceivedNumber) {
            return ZodErrorHandlingService._getZodExpectedStringReceivedNumberErrorMessage({
                firstError,
            });
        } else {
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

    private static _getZodExpectedStringReceivedNumberErrorMessage(options: {
        firstError: ZodIssue,
    }): ResponseModel {
        const { firstError } = options;
        return {
            status: 400,
            body: {
                error: 'Invalid Type',
                message: `'${firstError.path[0]}' is expected to be a string, but received a number`
            }
        };
    }
}

enum ZodErrorMessageEnum {
    REQUIRED = 'Required',
    EXPECTED_STRING_RECEIVED_NUMBER = 'Expected string, received number',
}