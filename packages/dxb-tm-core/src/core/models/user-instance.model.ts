import { z } from "zod";
import { DefaultDbFieldsSchema } from "./default-db-fields.model";



export const UserInstanceSchema = DefaultDbFieldsSchema.merge(
    z.object({
        fkUserId: z.number().int().nonnegative(),
        fkInstanceId: z.number().int().nonnegative()
    })
);

export type UserInstanceModel = z.infer<typeof UserInstanceSchema>;