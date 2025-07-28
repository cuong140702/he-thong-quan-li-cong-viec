import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
  roleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

export type UserType = z.infer<typeof UserSchema>
