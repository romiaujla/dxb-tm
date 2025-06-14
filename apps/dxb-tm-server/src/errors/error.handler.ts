import { ZodError } from "zod";
import type { ResponseModel } from "../models/response.model";
import { ZodErrorHandlingService } from "../services/zod-error-handling.service";
import { AppError, InternalServerError } from "./app.error";

export class ErrorHandler {
  public static handle(error: unknown): ResponseModel {
    if (error instanceof AppError) {
      return {
        status: error.statusCode,
        body: {
          message: error.message,
          error: error.error || this.getDefaultErrorForStatus(error.statusCode),
        },
      };
    }

    if (error instanceof ZodError) {
      return ZodErrorHandlingService.handleZodError({ error });
    }

    // Handle unknown errors
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

  private static getDefaultErrorForStatus(status: number): string {
    switch (status) {
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 404:
        return "Not Found";
      case 500:
        return "Internal Server Error";
      default:
        return "Unknown Error";
    }
  }
}
