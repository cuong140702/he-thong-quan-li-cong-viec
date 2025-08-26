import { Injectable } from '@nestjs/common'
import { GetPermissionsQueryType } from './permission.model'
import { PermissionRepo } from './permission.repo'
@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepo) {}

  async listPermissions(props: { query: GetPermissionsQueryType }) {
    return await this.permissionRepo.listPermissions(props.query)
  }
}
