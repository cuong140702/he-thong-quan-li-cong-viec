import { createZodDto } from 'nestjs-zod'
import {
  CreatePermissionBodySchema,
  GetPermissionByIdResSchema,
  GetPermissionParamsSchema,
  GetPermissionResSchema,
  GetPermissionsQuerySchema,
  UpdatePermissionBodySchema,
} from './permission.model'
import { PermissionSchema } from 'src/shared/models/shared-permission.model'

export class GetPermissionsResDTO extends createZodDto(GetPermissionResSchema) {}
export class GetPermissionsQueryDTO extends createZodDto(GetPermissionsQuerySchema) {}
export class CreatePermissionResDTO extends createZodDto(PermissionSchema) {}
export class UpdatePermissionResDTO extends createZodDto(PermissionSchema) {}
export class UpdatePermissionBodyDTO extends createZodDto(UpdatePermissionBodySchema) {}
export class CreatePermissionBodyDTO extends createZodDto(CreatePermissionBodySchema) {}
export class GetPermissionParamsDTO extends createZodDto(GetPermissionParamsSchema) {}
export class GetPermissionByIdResDTO extends createZodDto(GetPermissionByIdResSchema) {}
