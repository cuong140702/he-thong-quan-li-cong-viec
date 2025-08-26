import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { GetPermissionsQueryDTO, GetPermissionsResDTO } from './permission.dto'
import { PermissionService } from './permission.service'

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
}
