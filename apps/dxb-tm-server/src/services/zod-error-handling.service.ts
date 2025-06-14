import type { ObjectNameEnum } from "dxb-tm-core";
import { ZodError } from "zod";
import { ValidationError } from "../errors/app.error";
import type { ResponseModel } from "../models/response.model";

export class ZodErrorHandlingService {
  public static handleZodError(options: {
    error: ZodError;
    objectName?: ObjectNameEnum;
  }): ResponseModel {
    const { error, objectName } = options;
    const firstError = error.errors[0];

    if (firstError == null) {
      throw new ValidationError("Validation error");
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

    if (error.errors.length > 1) {
      throw new ValidationError(
        error.errors.map((e) => e.message).join(", "),
        "Multiple validation errors",
      );
    }

    if (isRequiredError && isInvalidType) {
      throw new ValidationError(
        `'${firstError.path[0]}' is a required field on the '${objectName}' table`,
      );
    }

    if (isInvalidType) {
      let message = firstError.message;
      if ("expected" in firstError && "received" in firstError) {
        message = `'${firstError.path[0]}' is expected to be a ${firstError.expected}, but received a ${firstError.received}`;
      }
      throw new ValidationError(message, "Invalid Type");
    }

    if (isTooSmall) {
      let message = `'${firstError.path[0]}' is too small`;
      if ("minimum" in firstError) {
        message = `'${firstError.path[0]}' is too small, minimum length is ${firstError.minimum}`;
      }
      throw new ValidationError(message);
    }

    if (isTooBig) {
      let message = `'${firstError.path[0]}' is too big`;
      if ("maximum" in firstError) {
        message = `'${firstError.path[0]}' is too big, maximum length is ${firstError.maximum}`;
      }
      throw new ValidationError(message);
    }

    if (isInvalidDate) {
      throw new ValidationError(`'${firstError.path[0]}' is not a valid date`);
    }

    if (isInvalidEmail) {
      throw new ValidationError(`'${firstError.path[0]}' is not a valid email`);
    }

    if (isInvalidString) {
      throw new ValidationError(
        `'${firstError.path[0]}' is not a valid string`,
      );
    }

    if (isInvalidEnum) {
      throw new ValidationError(
        `'${firstError.path[0]}' is not a valid enum value`,
      );
    }

    throw new ValidationError("Validation error");
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
}
