"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
    CardHeader,
    CardTitle,
} from "dxb-tm/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "dxb-tm/components/ui/form";
import { Input } from "dxb-tm/components/ui/input";
import { useAuth } from "dxb-tm/lib/hooks/use-auth";
import type { AlertContextType } from "dxb-tm/lib/models/alert.context-type";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const LoginPage = () => {
    const { login } = useAuth();

    const [error, setError] = useState<AlertContextType | null>(null);

    const LoginFormSchema = z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" }),
    });

    const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (formValues: z.infer<typeof LoginFormSchema>) => {
        try {
            await login(formValues);
        } catch (error) {
            setError({
                variant: "destructive",
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
            });
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
                    <FormProvider {...loginForm}>
                        <form
                            onSubmit={loginForm.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="m@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="********"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="link"
                                    className="w-full cursor-pointer"
                                >
                                    Login as Demo
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
