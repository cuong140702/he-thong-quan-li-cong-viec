import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreatePermissionBodyDTO,
  CreatePermissionResDTO,
  GetPermissionByIdResDTO,
  GetPermissionParamsDTO,
  GetPermissionsQueryDTO,
  GetPermissionsResDTO,
  UpdatePermissionBodyDTO,
  UpdatePermissionResDTO,
} from './permission.dto'
import { PermissionService } from './permission.service'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodSerializerDto(GetPermissionsResDTO)
  listPermissions(@Query() query: GetPermissionsQueryDTO) {
    return this.permissionService.listPermissions({
      query,
    })
  }

  @Post()
  @ZodSerializerDto(CreatePermissionResDTO)
  create(@Body() body: CreatePermissionBodyDTO) {
    return this.permissionService.createPermission({ data: body })
  }

  @Delete(':permissionId')
  @ZodSerializerDto(MessageResDTO)
  deletePermission(@Param() params: GetPermissionParamsDTO) {
    return this.permissionService.deletePermission({
      id: params.permissionId,
    })
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionByIdResDTO)
  getPermissionById(@Param() params: GetPermissionParamsDTO) {
    return this.permissionService.getPermissionById({
      id: params.permissionId,
    })
  }

  @Put(':permissionId')
  @ZodSerializerDto(UpdatePermissionResDTO)
  updatePermission(@Body() body: UpdatePermissionBodyDTO, @Param() params: GetPermissionParamsDTO) {
    return this.permissionService.updatePermission({
      data: body,
      id: String(params.permissionId),
    })
  }
}
