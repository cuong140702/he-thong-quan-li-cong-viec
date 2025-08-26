import { Injectable } from '@nestjs/common'
import { CreateRoleBodyType, GetRolesQueryType, UpdateRoleBodyType, UpdateRolePermissionsType } from './role.model'
import { RoleRepo } from './role.repo'
@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepo) {}

  async listRoles(props: { query: GetRolesQueryType }) {
    return await this.roleRepo.listRoles(props.query)
  }

  async createRole(props: { data: CreateRoleBodyType }) {
    return await this.roleRepo.createRole(props.data)
  }

  async deleteRole({ id }: { id: string }) {
    try {
      await this.roleRepo.deleteRole({
        id,
      })
      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async updateRole(props: { data: UpdateRoleBodyType; id: string }) {
    return await this.roleRepo.updateRole(props.data, props.id)
  }

  async getRolePermissions({ id }: { id: string }) {
    return await this.roleRepo.getRolePermissions(id)
  }

  async updateRolePermissions(roleId: string, body: UpdateRolePermissionsType) {
    return await this.roleRepo.updateRolePermissions(roleId, body)
  }
}
