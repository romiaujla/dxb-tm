import { randomBytes } from "crypto";
import type { UserModel } from "dxb-tm-core";

export function getRandomString(length = 6): string {
    return randomBytes(length)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, length);
}

export function getTestUser(): Partial<UserModel> {
    return {
        firstName: "Test",
        lastName: "User",
        email: "test@dxbtm.com",
        password: "test1234",
    };
}
