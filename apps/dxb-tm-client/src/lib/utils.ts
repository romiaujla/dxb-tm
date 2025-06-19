import { clsx, type ClassValue } from "clsx";
import PasswordValidator from "password-validator";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function httpRequest(options: {
    endpoint: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    method: "GET" | "POST" | "PUT" | "DELETE";
}): Promise<Response> {
    const { endpoint, headers, method, body } = options;
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
            {
                headers: { ...headers, "Content-Type": "application/json" },
                method,
                body: JSON.stringify(body),
            },
        );

        if (response.ok) {
            return response;
        }

        let errorMessage = response.statusText;
        const data = await response.json();
        if (data && data.message) {
            errorMessage = data.message;
        }

        throw new Error(errorMessage);
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : "An unknown error occurred",
        );
    }
}

export function passwordValidationSchema(): PasswordValidator {
    return new PasswordValidator()
        .is()
        .min(8)
        .is()
        .max(100)
        .has()
        .uppercase()
        .has()
        .lowercase()
        .has()
        .digits()
        .has()
        .symbols()
        .has()
        .not()
        .spaces()
        .is()
        .not()
        .oneOf([
            "Passw0rd",
            "Password123",
            "Password",
            "Password1234",
            "Password12345",
            "Password123456",
            "Password1234567",
            "Password12345678",
            "Password123456789",
            "Password1234567890",
        ]);
}
