"use client";

import { Label } from "@radix-ui/react-label";
import { ModeToggle } from "dxb-tm/components/mode-toggle";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "dxb-tm/components/ui/alert";
import { Button } from "dxb-tm/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "dxb-tm/components/ui/card";
import { Input } from "dxb-tm/components/ui/input";
import { useAuth } from "dxb-tm/lib/hooks/use-auth";
import type { AlertContextType } from "dxb-tm/lib/models/alert.context-type";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const LoginPage = () => {
    const { login } = useAuth();
    const [error, setError] = useState<AlertContextType | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const form = window.document.getElementById("login-form");

        try {
            if (form instanceof HTMLFormElement) {
                const formData = new FormData(form);

                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                await login({ email, password });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError({
                    variant: "destructive",
                    title: "Error",
                    description: error.message,
                });
            } else {
                setError({
                    variant: "destructive",
                    title: "Error",
                    description: "An unknown error occurred",
                });
            }
        }
    };

    useEffect(() => {
        if (error != null) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="">
            {error != null && (
                <Alert
                    variant={error.variant}
                    className="fixed top-10 right-10 z-50 max-w-sm"
                >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{error.title}</AlertTitle>
                    <AlertDescription>{error.description}</AlertDescription>
                </Alert>
            )}

            <div className="fixed top-10 right-10">
                <ModeToggle />
            </div>
            <Card className="w-full max-w-sm mx-auto mt-10">
                <CardHeader className="text-center">
                    <CardTitle>Welcome to DXB TM</CardTitle>
                    <CardDescription>
                        Login to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="login-form">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    name="email"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    name="password"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                    <Button variant="outline" className="w-full cursor-pointer">
                        Sign Up
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
