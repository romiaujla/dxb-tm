import type { ObjectNameEnum } from "dxb-tm-core";
import { ZodError, ZodIssue } from "zod";
import type { ResponseModel } from "../models/response.model";

export class ZodErrorHandlingService {
  public static handleZodError(options: {
    error: ZodError;
    objectName?: ObjectNameEnum;
  }): ResponseModel {
    const { error, objectName } = options;
    const firstError = error.errors[0];

    if (firstError == null) {
      return ZodErrorHandlingService._getDefaultErrorResponse(error);
    }

    const isRequiredError = firstError.message === ZodErrorMessageEnum.REQUIRED;
    const isInvalidType = firstError.code === ZodErrorCodeEnum.INVALID_TYPE;
    const isTooSmall = firstError.code === ZodErrorCodeEnum.TOO_SMALL;
    const isTooBig = firstError.code === ZodErrorCodeEnum.TOO_BIG;
    const isInvalidDate = firstError.code === ZodErrorCodeEnum.INVALID_DATE;
    const isInvalidEmail =
      firstError.message === ZodErrorMessageEnum.INVALID_EMAIL;
    const isInvalidString = firstError.code === ZodErrorCodeEnum.INVALID_STRING;
    const isInvalidEnum =
      firstError.code === ZodErrorCodeEnum.INVALID_ENUM_VALUE;
    const isInvalidFormat = firstError.code === ZodErrorCodeEnum.INVALID_STRING;

    if (isRequiredError && isInvalidType) {
      return ZodErrorHandlingService._getZodRequiredErrorMessage({
        firstError,
        objectName,
      });
    }

    if (isInvalidType) {
      return ZodErrorHandlingService._getZodInvalidTypeErrorMessage({
        firstError,
      });
    }

    if (isTooSmall) {
      return ZodErrorHandlingService._getZodTooSmallErrorMessage({
        firstError,
      });
    }

    if (isTooBig) {
      return ZodErrorHandlingService._getZodTooBigErrorMessage({
        firstError,
      });
    }

    if (isInvalidDate) {
      return ZodErrorHandlingService._getZodInvalidDateErrorMessage({
        firstError,
      });
    }

    if (isInvalidEmail) {
      return ZodErrorHandlingService._getZodInvalidEmailErrorMessage({
        firstError,
      });
    }

    if (isInvalidString) {
      return ZodErrorHandlingService._getZodInvalidStringErrorMessage({
        firstError,
      });
    }

    if (isInvalidEnum) {
      return ZodErrorHandlingService._getZodInvalidEnumErrorMessage({
        firstError,
      });
    }

    if (isInvalidFormat) {
      return ZodErrorHandlingService._getZodInvalidFormatErrorMessage({
        firstError,
      });
    }

    if (error.errors.length > 1) {
      return ZodErrorHandlingService._getMultipleErrorsResponse(error);
    }

    return ZodErrorHandlingService._getDefaultErrorResponse(error);
  }

  private static _getDefaultErrorResponse(error: ZodError): ResponseModel {
    return {
      status: 400,
      body: {
        error: error.errors.map((e) => e.message).join(", "),
        message: "Validation error",
      },
    };
  }

  private static _getZodRequiredErrorMessage(options: {
    firstError: ZodIssue;
    objectName?: ObjectNameEnum;
  }): ResponseModel {
    const { firstError, objectName = "Unknown Object" } = options;
    return {
      status: 400,
      body: {
        error: "Validation Error",
        message: `'${firstError.path[0]}' is a required field on the '${objectName}' table`,
      },
    };
  }

  private static _getZodInvalidTypeErrorMessage(options: {
    firstError: ZodIssue;
  }): ResponseModel {
    const { firstError } = options;

    let message = firstError.message;

    if ("expected" in firstError && "received" in firstError) {
      message = `'${firstError.path[0]}' is expected to be a ${firstError.expected}, but received a ${firstError.received}`;
    }
    return {
      status: 400,
      body: {
        error: "Invalid Type",
        message,
      },
    };
  }

  private static _getZodTooSmallErrorMessage(options: {
    firstError: ZodIssue;
  }): ResponseModel {
    const { firstError } = options;

    let message = `'${firstError.path[0]}' is too small`;

    if ("minimum" in firstError) {
      message = `'${firstError.path[0]}' is too small, minimum length is ${firstError.minimum}`;
    }

    return {
      status: 400,
      body: {
        error: "Validation Error",
        message,
      },
    };
  }

  private static _getZodTooBigErrorMessage(options: {
    firstError: ZodIssue;
  }): ResponseModel {
    const { firstError } = options;
    let message = `'${firstError.path[0]}' is too big`;

    if ("maximum" in firstError) {
      message = `'${firstError.path[0]}' is too big, maximum length is ${firstError.maximum}`;
    }

    return {
      status: 400,
      body: {
        error: "Validation Error",
        message,
      },
    };
  }

  private static _getZodInvalidDateErrorMessage(options: {
    firstError: ZodIssue;
  }): ResponseModel {
    const { firstError } = options;
    return {
      status: 400,
      body: {
        error: "Validation Error",
        message: `'${firstError.path[0]}' is not a valid date`,
      },
    };
  }

  private static _getZodInvalidEmailErrorMessage(options: {
    firstError: ZodIssue;
  }): ResponseModel {
    const { firstError } = options;
    return {
      status: 400,
      body: {
        error: "Validation Error",
        message: `'${firstError.path[0]}' is not a valid email`,
      },
    };
  }

  private static _getZodInvalidStringErrorMessage(options: {
    firstError: ZodIssue;
  }): ResponseModel {
    const { firstError } = options;
    return {
      status: 400,
      body: {
        error: "Validation Error",
        message: `'${firstError.path[0]}' is not a valid string`,
      },
    };
  }

  private static _getZodInvalidEnumErrorMessage(options: {
    firstError: ZodIssue;
  }): ResponseModel {
    const { firstError } = options;
    return {
      status: 400,
      body: {
        error: "Validation Error",
        message: `'${firstError.path[0]}' is not a valid enum value`,
      },
    };
  }

  private static _getZodInvalidFormatErrorMessage(options: {
    firstError: ZodIssue;
  }): ResponseModel {
    const { firstError } = options;
    return {
      status: 400,
      body: {
        error: "Validation Error",
        message: `'${firstError.path[0]}' has an invalid format`,
      },
    };
  }

  private static _getMultipleErrorsResponse(error: ZodError): ResponseModel {
    return {
      status: 400,
      body: {
        error: "Multiple validation errors",
        message: error.errors.map((e) => e.message).join(", "),
      },
    };
  }
}

enum ZodErrorMessageEnum {
  REQUIRED = "Required",
  INVALID_EMAIL = "Invalid email",
}

enum ZodErrorCodeEnum {
  INVALID_TYPE = "invalid_type",
  TOO_SMALL = "too_small",
  TOO_BIG = "too_big",
  INVALID_DATE = "invalid_date",
  INVALID_STRING = "invalid_string",
  INVALID_ENUM_VALUE = "invalid_enum_value",
  INVALID_FORMAT = "invalid_format",
}
