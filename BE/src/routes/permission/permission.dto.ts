import { createZodDto } from 'nestjs-zod'
import { GetPermissionResSchema, GetPermissionsQuerySchema } from './permission.model'

export class GetPermissionsResDTO extends createZodDto(GetPermissionResSchema) {}
export class GetPermissionsQueryDTO extends createZodDto(GetPermissionsQuerySchema) {}
