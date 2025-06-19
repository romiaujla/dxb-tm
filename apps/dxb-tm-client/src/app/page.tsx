import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
    const token = (await cookies()).get("token");

    return (
        <main className="flex h-screen w-screen items-center justify-center">
            <Link href="/auth/login">Login Page</Link>
        </main>
    );
}
