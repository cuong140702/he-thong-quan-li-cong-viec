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

export type GetPermissionsResType = z.infer<typeof GetPermissionResSchema>
export type GetPermissionsQueryType = z.infer<typeof GetPermissionsQuerySchema>
