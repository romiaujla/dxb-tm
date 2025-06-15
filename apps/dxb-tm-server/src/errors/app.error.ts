import type { HttpStatusCode } from "../models/response.model";

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public error?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation Error",
    error: string = "Validation Error",
  ) {
    super(400, message, error);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", error: string = "Bad Request") {
    super(400, message, error);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Unauthorized",
    error: string = "Unauthorized",
  ) {
    super(401, message, error);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", error: string = "Forbidden") {
    super(403, message, error);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found", error: string = "Not Found") {
    super(404, message, error);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal Server Error",
    error: string = "Internal Server Error",
  ) {
    super(500, message, error);
  }
}
