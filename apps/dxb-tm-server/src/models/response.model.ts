export interface ResponseModel {
    status: HttpStatusCode;
    body: {
        message: string;
        error?: string;
        stack?: Array<string>;
    };
}

export type HTTPInformationalStatus = 100 | 101 | 102 | 103;
export type HTTPSuccessStatus =
    | 200
    | 201
    | 202
    | 203
    | 204
    | 205
    | 206
    | 207
    | 208
    | 226;
export type HTTPRedirectionStatus =
    | 300
    | 301
    | 302
    | 303
    | 304
    | 305
    | 306
    | 307
    | 308;
export type HTTPClientErrorStatus =
    | 400
    | 401
    | 402
    | 403
    | 404
    | 405
    | 406
    | 407
    | 408
    | 409
    | 410
    | 411
    | 412
    | 413
    | 414
    | 415
    | 416
    | 417
    | 418
    | 421
    | 422
    | 423
    | 424
    | 425
    | 426
    | 428
    | 429
    | 431
    | 451;
export type HTTPServerErrorStatus =
    | 500
    | 501
    | 502
    | 503
    | 504
    | 505
    | 506
    | 507
    | 508
    | 510
    | 511;

export type HttpStatusCode =
    | HTTPInformationalStatus
    | HTTPSuccessStatus
    | HTTPRedirectionStatus
    | HTTPClientErrorStatus
    | HTTPServerErrorStatus;
