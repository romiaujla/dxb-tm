import { z } from 'zod';

export const DefaultDbFieldsSchema = z.object({
    id: z.number().int().positive('ID must be a positive number'),
    createdAt: z.date().min(new Date(0), 'Created At must be a valid date'),
    createdById: z.number().int().nonnegative('createdBy must be a non-negative number'),
    updatedAt: z.date().min(new Date(0), 'Updated At must be a valid date'),
    updatedById: z.number().int().nonnegative('updatedBy must be a non-negative number'),
    deletedAt: z.date().min(new Date(0), 'Deleted At must be a valid date').optional(),
    deletedById: z.number().int().nonnegative('deletedBy must be a non-negative number').optional(),
});

export type DefaultDbFieldsModel = z.infer<typeof DefaultDbFieldsSchema>;