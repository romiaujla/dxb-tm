"use client";

import { useAuth } from "dxb-tm/lib/hooks/use-auth";
import { useEffect } from "react";

export default function Dashboard() {
    const { validate } = useAuth();

    useEffect(() => {
        const validateAuth = async () => {
            await validate();
        };

        validateAuth();
    }, [validate]);

    return <div>Dashboard</div>;
}
