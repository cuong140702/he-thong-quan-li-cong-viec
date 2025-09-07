import { PermissionSchema } from 'src/shared/models/shared-permission.model'
import { RoleSchema } from 'src/shared/models/shared-role.model'
import { UserSchema } from 'src/shared/models/shared-user.model'
import z from 'zod'

export const GetRolesResSchema = z.object({
  data: z.array(
    RoleSchema.extend({
      user: UserSchema.pick({
        id: true,
        fullName: true,
      }).optional(),
      permissions: z
        .array(
          PermissionSchema.pick({
            module: true,
            path: true,
            method: true,
          }),
        )
        .optional(),
    }),
  ),
  totalItems: z.number(),
  page: z.number(), // Số trang hiện tại
  limit: z.number(), // Số item trên 1 trang
  totalPages: z.number(), // Tổng số trang
})

export const GetRoleByIdResSchema = RoleSchema

export const GetRoleParamsSchema = z
  .object({
    roleId: z.string().uuid(),
  })
  .strict()

export const CreateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
}).extend({
  permissions: z.array(z.string().uuid()).optional(),
})

// Query schema
export const GetRolesQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    permissions: z
      .preprocess((value) => {
        if (typeof value === 'string') {
          return [value]
        }
        return value
      }, z.array(z.string().uuid()))
      .optional(),
  })
  .strict()

export const UpdateRolePermissionsSchema = z
  .object({
    permissions: z.array(z.string().min(1, 'Permission id không được để trống')),
  })
  .strict()

export const UpdateRolePermissionsResSchema = z.object({
  role: RoleSchema.extend({
    permissions: z.array(
      PermissionSchema.pick({
        id: true,
        module: true,
        path: true,
        method: true,
      }),
    ),
  }),
})

export const UpdateRoleBodySchema = CreateRoleBodySchema

export const CreateRoleResSchema = CreateRoleBodySchema

export const UpdateRoleResSchema = CreateRoleBodySchema

export type GetRolesResType = z.infer<typeof GetRolesResSchema>
export type GetRolesQueryType = z.infer<typeof GetRolesQuerySchema>
export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>
export type CreateRoleResType = z.infer<typeof CreateRoleResSchema>
export type UpdateRoleResType = z.infer<typeof UpdateRoleResSchema>
export type UpdateRolePermissionsResType = z.infer<typeof UpdateRolePermissionsResSchema>
export type UpdateRolePermissionsType = z.infer<typeof UpdateRolePermissionsSchema>
