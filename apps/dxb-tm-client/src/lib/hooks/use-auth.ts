"use client";

import { redirect } from "next/navigation";
import { httpRequest } from "../utils";

export function useAuth(): AuthContextType {
    return {
        isAuthenticated: false,
        isLoading: false,
        login: async ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }): Promise<void> => {
            try {
                await httpRequest({
                    endpoint: "/auth/login",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: { email, password },
                });

                redirect("/dashboard");
            } catch (error: unknown) {
                throw new Error(
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
                );
            }
        },
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
