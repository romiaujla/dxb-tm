import { z } from "zod";
import { DefaultDbFieldsSchema } from "./default-db-fields.model";

export const UserSchema = DefaultDbFieldsSchema.merge(
    z.object({
        firstName: z.string(),
        middleName: z.string().optional(),
        lastName: z.string(),
        email: z.string().email(),
        password: z.string(),
        active: z.boolean().default(true),
    })
);

export type UserModel = z.infer<typeof UserSchema>;