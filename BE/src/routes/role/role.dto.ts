import { createZodDto } from 'nestjs-zod'
import {
  CreateRoleBodySchema,
  CreateRoleResSchema,
  GetRoleParamsSchema,
  GetRolesQuerySchema,
  GetRolesResSchema,
  UpdateRoleBodySchema,
  UpdateRolePermissionsResSchema,
  UpdateRolePermissionsSchema,
  UpdateRoleResSchema,
} from './role.model'
import { RolePermissionsSchema } from 'src/shared/models/shared-role.model'

export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}
export class GetRolesQueryDTO extends createZodDto(GetRolesQuerySchema) {}
export class CreateRoleBodyDTO extends createZodDto(CreateRoleBodySchema) {}
export class UpdateRoleBodyDTO extends createZodDto(UpdateRoleBodySchema) {}

export class CreateRoleResDTO extends createZodDto(CreateRoleResSchema) {}
export class UpdateRoleResDTO extends createZodDto(UpdateRoleResSchema) {}
export class GetRoleParamsDTO extends createZodDto(GetRoleParamsSchema) {}
export class RolePermissionsResDTO extends createZodDto(RolePermissionsSchema) {}
export class UpdateRolePermissionsDto extends createZodDto(UpdateRolePermissionsSchema) {}
export class UpdateRolePermissionsResDTO extends createZodDto(UpdateRolePermissionsResSchema) {}
