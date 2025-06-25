"use client";

import { useAuth } from "dxb-tm/lib/hooks/use-auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { validate } = useAuth();

    useEffect(() => {
        const validateAuth = async () => {
            const isAuthenticated = await validate();
            if (isAuthenticated) {
                redirect("/dashboard");
            } else {
                redirect("/login");
            }
        };

        validateAuth();
    }, [validate]);

    return null;
}
