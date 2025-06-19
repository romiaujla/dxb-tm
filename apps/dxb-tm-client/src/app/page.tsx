"use client";

import { useAuth } from "dxb-tm/lib/hooks/use-auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            redirect("/dashboard");
        } else {
            redirect("/login");
        }
    }, [isAuthenticated]);

    return null;
}
