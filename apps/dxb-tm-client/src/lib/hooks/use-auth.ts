"use client";

import { useRouter } from "next/navigation";
import { httpRequest } from "../utils";

export function useAuth(): AuthContextType {
    const router = useRouter();

    const login = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<void> => {
        try {
            const response = await httpRequest({
                endpoint: "/auth/login",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: { email, password },
            });

            if (response.ok) {
                router.push("/dashboard");
            }

            throw new Error(response.statusText);
        } catch (error: unknown) {
            throw new Error(
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
            );
        }
    };

    return {
        isAuthenticated: false,
        isLoading: false,
        login,
        logout: () => {},
    };
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => Promise<void>;
    logout: () => void;
}
