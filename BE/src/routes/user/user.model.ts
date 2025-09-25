import { z } from 'zod'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { RoleSchema } from 'src/shared/models/shared-role.model'

export const GetUsersResSchema = z.object({
  data: z.array(
    UserSchema.omit({ password: true }).extend({
      role: RoleSchema.pick({
        id: true,
        name: true,
      }),
    }),
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export const GetUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict()

export const GetUserParamsSchema = z
  .object({
    userId: z.string().uuid(),
  })
  .strict()

export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  password: true,
  roleId: true,
  fullName: true,
}).strict()

export const UpdateProfileResSchema = UserSchema.omit({
  password: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  isOnline: true,
  lastSeen: true,
}).extend({
  accessToken: z.string(),
  refreshToken: z.string(),
  role: RoleSchema.pick({
    id: true,
    name: true,
  }),
})

export const UpdateUserBodySchema = UserSchema.pick({
  fullName: true,
  email: true,
  roleId: true,
  avatarUrl: true,
})
  .extend({
    refreshToken: z.string(),
  })
  .strict()

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict()

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSchema.pick({
    id: true,
    email: true,
    fullName: true,
  }).extend({
    role: z.string().nullable(),
  }),
})

export const RefreshTokenResSchema = LoginResSchema

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
  userId: z.string(),
  expiredAt: z.date(),
  createdAt: z.date(),
})

export const GetUserByIdSchema = UserSchema.pick({
  email: true,
  fullName: true,
  roleId: true,
  password: true,
})

export const LogoutBodySchema = RefreshTokenBodySchema

export type GetUsersResType = z.infer<typeof GetUsersResSchema>
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
export type GetUsersQueryType = z.infer<typeof GetUsersQuerySchema>
export type GetUserParamsType = z.infer<typeof GetUserParamsSchema>
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>
