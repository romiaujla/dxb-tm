"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { httpRequest } from "../utils";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const validateToken = async (token: string): Promise<boolean> => {
        const response = await httpRequest("/auth/validate", {
            Authorization: `Bearer ${token}`,
        });

        if (response.ok) {
            return true;
        }

        return false;
    };

    useEffect(() => {
        const token = Cookies.get("token");
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        Cookies.set("token", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        isLoading,
        login,
        logout,
    };
}
