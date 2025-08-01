import { z } from "zod";
import { DefaultDbFieldsSchema } from "./default-db-fields.model";

export const RolePermissionSchema = DefaultDbFieldsSchema.merge(
    z.object({
        fkRoleId: z.number().int().nonnegative(),
        fkPermissionId: z.number().int().nonnegative(),
    }),
);

export type RolePermissionModel = z.infer<typeof RolePermissionSchema>;
