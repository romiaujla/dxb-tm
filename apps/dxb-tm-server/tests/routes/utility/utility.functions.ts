import { randomBytes } from "crypto";

export function getRandomString(length = 6): string {
    return randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, length);
}