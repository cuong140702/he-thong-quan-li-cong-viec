import { PermissionSchema } from 'src/shared/models/shared-permission.model'
import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string().max(500),
  description: z.string().nullable(),
  deletedAt: z.date().nullable(),
})

export const RolePermissionsSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
})

export type RoleType = z.infer<typeof RoleSchema>
export type RolePermissionsType = z.infer<typeof RolePermissionsSchema>
