import { z } from 'zod';
import { DefaultDbFieldsSchema } from './default-db-fields.model';

export const InstanceSchema = DefaultDbFieldsSchema.merge(
    z.object({
        name: z.string().min(1, 'Name is required'),
        alias: z.string().min(1, 'Alias is required'),
        description: z.string().optional(),
        active: z.boolean().default(true),
    })
);

export type InstanceModel = z.infer<typeof InstanceSchema>;
