import { PermissionSchema } from 'src/shared/models/shared-permission.model'
import { RoleSchema } from 'src/shared/models/shared-role.model'
import z from 'zod'

export const GetPermissionResSchema = z.object({
  data: z.array(
    PermissionSchema.extend({
      roles: z
        .array(
          RoleSchema.pick({
            id: true,
            name: true,
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

export const GetPermissionsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict()

export const GetPermissionParamsSchema = z
  .object({
    permissionId: z.string().uuid(),
  })
  .strict()

export const CreatePermissionBodySchema = PermissionSchema.pick({
  path: true,
  description: true,
  method: true,
  module: true,
}).strict()

export const GetPermissionByIdResSchema = PermissionSchema.pick({
  path: true,
  description: true,
  method: true,
  module: true,
})

export const GetAllModulesResSchema = z.object({
  data: z.array(PermissionSchema.pick({ module: true })),
})

export const UpdatePermissionBodySchema = CreatePermissionBodySchema

export type GetPermissionsResType = z.infer<typeof GetPermissionResSchema>
export type GetPermissionsQueryType = z.infer<typeof GetPermissionsQuerySchema>
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>
export type GetPermissionByIdResType = z.infer<typeof GetPermissionByIdResSchema>
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>
export type GetAllModulesResType = z.infer<typeof GetAllModulesResSchema>
