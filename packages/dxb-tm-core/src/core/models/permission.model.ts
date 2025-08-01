import { z } from "zod";
import { DefaultDbFieldsSchema } from "./default-db-fields.model";

export const PermissionSchema = DefaultDbFieldsSchema.merge(
    z.object({
        action: z.string(),
        description: z.string().optional(),
    }),
);

export type PermissionModel = z.infer<typeof PermissionSchema>;
