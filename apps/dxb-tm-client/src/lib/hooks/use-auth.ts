"use client";

export function useAuth(): AuthContextType {
    return {
        isAuthenticated: false,
        isLoading: false,
        login: () => {},
        logout: () => {},
    };
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}
