import {
  InternalServerError,
  UnauthorizedError,
  ValidationError,
} from "../errors/app.error";
import type { ResponseModel } from "../models/response.model";

export class ErrorHandlingService {
  public static get500InternalErrorResponse(error: unknown): ResponseModel {
    const internalError = new InternalServerError(
      "An unexpected error occurred",
      "Internal server error",
    );

    return {
      status: internalError.statusCode,
      body: {
        message: internalError.message,
        error: internalError.error,
        stack: error instanceof Error ? error.stack?.split("\n") : undefined,
      },
    };
  }

  public static get400BadRequestErrorResponse(options: {
    message: string;
    error?: string;
  }): ResponseModel {
    const validationError = new ValidationError(options.message, options.error);

    return {
      status: validationError.statusCode,
      body: {
        error: validationError.error,
        message: validationError.message,
      },
    };
  }

  public static get401UnauthorizedErrorResponse(options: {
    message: string;
    error?: string;
  }): ResponseModel {
    const unauthorizedError = new UnauthorizedError(
      options.message,
      options.error,
    );

    return {
      status: unauthorizedError.statusCode,
      body: {
        error: unauthorizedError.error,
        message: unauthorizedError.message,
      },
    };
  }
}
