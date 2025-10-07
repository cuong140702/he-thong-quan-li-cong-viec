import { Injectable } from '@nestjs/common'
import { CreatePermissionBodyType, GetPermissionsQueryType, UpdatePermissionBodyType } from './permission.model'
import { PermissionRepo } from './permission.repo'
@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepo) {}

  async listPermissions(props: { query: GetPermissionsQueryType }) {
    return await this.permissionRepo.listPermissions(props.query)
  }

  async createPermission(props: { data: CreatePermissionBodyType }) {
    return await this.permissionRepo.createPermission(props.data)
  }

  async deletePermission({ id }: { id: string }) {
    try {
      await this.permissionRepo.deletePermission({
        id,
      })
      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async getPermissionById({ id }: { id: string }) {
    return await this.permissionRepo.getPermissionById(id)
  }

  async updatePermission(props: { data: UpdatePermissionBodyType; id: string }) {
    return await this.permissionRepo.updatePermission(props.data, props.id)
  }

  async getAllModules() {
    return await this.permissionRepo.getAllModules()
  }
}
