import { z } from "zod";
import { DefaultDbFieldsSchema } from "./default-db-fields.model";

export const RoleSchema = DefaultDbFieldsSchema.merge(
    z.object({
        name: z.string(),
        description: z.string().optional(),
    }),
);

export type UserModel = z.infer<typeof RoleSchema>;
