import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function httpRequest(
    endpoint: string,
    headers: Record<string, string>,
): Promise<Response> {
    try {
        const response = await fetch(`${process.env.API_URL}${endpoint}`, {
            headers,
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
