import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { Prisma } from '@prisma/client'
import {
  CreateRoleBodyType,
  CreateRoleResType,
  GetRolesResType,
  UpdateRoleBodyType,
  UpdateRolePermissionsResType,
  UpdateRolePermissionsType,
  UpdateRoleResType,
} from './role.model'
import { RolePermissionsType } from 'src/shared/models/shared-role.model'

@Injectable()
export class RoleRepo {
  constructor(private prismaService: PrismaService) {}

  async listRoles({
    limit,
    page,
    permissions,
  }: {
    limit: number
    page: number
    permissions?: string[]
  }): Promise<GetRolesResType> {
    const skip = (page - 1) * limit
    const take = limit

    let where: Prisma.RoleWhereInput = {
      deletedAt: null,
    }

    if (permissions && permissions.length > 0) {
      where = {
        ...where,
        permissions: {
          some: {
            id: {
              in: permissions,
            },
          },
        },
      }
    }

    // Lấy tổng số role + dữ liệu
    const [totalItems, data] = await Promise.all([
      this.prismaService.role.count({ where }),
      this.prismaService.role.findMany({
        skip,
        take,
        where,
        include: {
          permissions: {
            select: {
              module: true,
              path: true,
              method: true,
            },
          }, // lấy tất cả permissions
          users: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      }),
    ])

    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    }
  }

  async createRole(data: CreateRoleBodyType): Promise<CreateRoleResType> {
    const { name, description, permissions = [] } = data

    const role = await this.prismaService.role.create({
      data: {
        name,
        description: description || '',
        permissions: permissions ? { connect: permissions.map((id) => ({ id })) } : undefined,
      },
      include: {
        permissions: true,
      },
    })

    return {
      ...role,
      permissions: role.permissions.map((tag) => tag.id),
    }
  }

  async updateRole(data: UpdateRoleBodyType, id: string): Promise<UpdateRoleResType> {
    const { permissions, ...rest } = data

    const updatedRole = await this.prismaService.role.update({
      where: { id },
      data: {
        ...rest,
        description: rest.description ?? undefined,
        permissions: permissions ? { set: permissions.map((id) => ({ id })) } : undefined,
      },
      include: {
        permissions: true,
      },
    })

    return {
      ...updatedRole,
      permissions: updatedRole.permissions.map((p) => p.id),
    }
  }

  deleteRole(
    {
      id,
    }: {
      id: string
    },
    isHard?: boolean,
  ) {
    return isHard
      ? this.prismaService.role.delete({
          where: {
            id,
          },
        })
      : this.prismaService.role.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        })
  }

  async getRolePermissions(id: string): Promise<RolePermissionsType> {
    const role = await this.prismaService.role.findUnique({
      where: { id },
      include: { permissions: true },
    })

    if (!role) throw new Error('Role not found')

    return {
      id: role.id,
      name: role.name,
      description: role.description ?? null,
      deletedAt: role.deletedAt,
      permissions: role.permissions.map((p) => ({
        id: p.id,
        path: p.path,
        method: p.method,
        module: p.module,
        description: p.description ?? undefined,
      })),
    }
  }

  async getRoleById(id: string) {
    const role = await this.prismaService.role.findUnique({
      where: { id },
      include: { permissions: true },
    })
    if (!role) throw new NotFoundException(`Role ${id} not found`)
    return role
  }

  async updateRolePermissions(roleId: string, body: UpdateRolePermissionsType): Promise<UpdateRolePermissionsResType> {
    const role = await this.prismaService.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    })

    if (!role) {
      throw new NotFoundException(`Role ${roleId} not found`)
    }

    const currentPermissions = role.permissions.map((p) => p.id)

    const toAdd = body.permissions.filter((p) => !currentPermissions.includes(p))
    const toRemove = currentPermissions.filter((p) => !body.permissions.includes(p))

    const updatedRole = await this.prismaService.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: toAdd.map((id) => ({ id })),
          disconnect: toRemove.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    })

    return {
      role: updatedRole,
    }
  }
}
