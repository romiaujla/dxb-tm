import type { ResponseModel } from "../models/response.model";

export class ErrorHandlingService {
    public static get500InternalErrorResponse(): ResponseModel {
        return {
            status: 500,
            body: {
                message: 'Internal server error',
                error: 'An unexpected error occurred'
            }
        }
    }

    public static get400BadRequestErrorResponse(options: { message: string }): ResponseModel {
        return {
            status: 400,
            body: {
                message: options.message
            }
        }
    }
}