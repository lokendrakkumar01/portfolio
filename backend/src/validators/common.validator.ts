import { z } from 'zod';

export const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    displayOrder: z.number(),
  })),
});
