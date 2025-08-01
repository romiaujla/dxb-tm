import { z } from "zod";
import { DefaultDbFieldsSchema } from "./default-db-fields.model";

export const UserRoleSchema = DefaultDbFieldsSchema.merge(
    z.object({
        fkRoleId: z.number().int().nonnegative(),
        fkUserId: z.number().int().nonnegative(),
    }),
);

export type UserRoleModel = z.infer<typeof UserRoleSchema>;
