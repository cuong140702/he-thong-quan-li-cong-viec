import z from 'zod'

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  deletedAt: z.date().nullable(),
})
