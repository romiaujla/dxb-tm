import { z } from 'zod';

export const DefaultDbFieldsSchema = z.object({
    id: z.number().int().positive('ID must be a positive number'),
    createdAt: z.date().min(new Date(0), 'Created date must be a valid date'),
    updatedAt: z.date(),
    createdBy: z.number().int().nonnegative('createdBy must be a non-negative number'),
    updatedBy: z.number().int().nonnegative('updatedBy must be a non-negative number'),
    deletedAt: z.date().optional(),
    deletedBy: z.number().int().nonnegative('deletedBy must be a non-negative number').optional(),
});

export type DefaultDbFieldsModel = z.infer<typeof DefaultDbFieldsSchema>;