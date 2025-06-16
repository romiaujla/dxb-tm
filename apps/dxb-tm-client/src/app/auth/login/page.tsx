import { Label } from "@radix-ui/react-label";
import { ModeToggle } from "dxb-tm/components/mode-toggle";
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

const LoginPage = () => {
    return (
        <div className="">
            <div className="absolute top-10 right-10">
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
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
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
                                <Input id="password" type="password" required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full cursor-pointer">
                        Login
                    </Button>
                    <Button variant="outline" className="w-full">
                        Sign Up
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
