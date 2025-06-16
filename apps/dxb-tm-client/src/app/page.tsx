import { ModeToggle } from "dxb-tm/components/mode-toggle";
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex h-screen w-screen items-center justify-center">
            Home Page
            <br />
            <Link href="/auth/login">Login Page</Link>
            <ModeToggle />
        </main>
    );
}
