import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import {
  CreateRoleBodyDTO,
  CreateRoleResDTO,
  GetRoleParamsDTO,
  GetRolesQueryDTO,
  GetRolesResDTO,
  RolePermissionsResDTO,
  UpdateRoleBodyDTO,
  UpdateRolePermissionsDto,
  UpdateRolePermissionsResDTO,
  UpdateRoleResDTO,
} from './role.dto'
import { RoleService } from './role.service'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ZodSerializerDto(GetRolesResDTO)
  listRoles(@Query() query: GetRolesQueryDTO) {
    return this.roleService.listRoles({
      query,
    })
  }

  @Get('role-permission/:roleId')
  @ZodSerializerDto(RolePermissionsResDTO)
  getRolePermissions(@Param() params: GetRoleParamsDTO) {
    return this.roleService.getRolePermissions({
      id: params.roleId,
    })
  }

  @Get(':roleId')
  @ZodSerializerDto(RolePermissionsResDTO)
  getRoleById(@Param() params: GetRoleParamsDTO) {
    return this.roleService.getRoleById({
      id: params.roleId,
    })
  }

  @Put(':roleId/permissions')
  @ZodSerializerDto(UpdateRolePermissionsResDTO)
  updateRolePermissions(@Param() params: GetRoleParamsDTO, @Body() body: UpdateRolePermissionsDto) {
    return this.roleService.updateRolePermissions(params.roleId, body)
  }

  @Post()
  @ZodSerializerDto(CreateRoleResDTO)
  createRole(@Body() body: CreateRoleBodyDTO) {
    return this.roleService.createRole({ data: body })
  }

  @Put(':roleId')
  @ZodSerializerDto(UpdateRoleResDTO)
  updateRole(@Body() body: UpdateRoleBodyDTO, @Param() params: GetRoleParamsDTO) {
    return this.roleService.updateRole({
      data: body,
      id: String(params.roleId),
    })
  }

  @Delete(':roleId')
  @ZodSerializerDto(MessageResDTO)
  deleteRole(@Param() params: GetRoleParamsDTO) {
    return this.roleService.deleteRole({
      id: params.roleId,
    })
  }
}
