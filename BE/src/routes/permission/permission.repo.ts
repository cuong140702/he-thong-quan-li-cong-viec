import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { Prisma } from '@prisma/client'
import {
  CreatePermissionBodyType,
  GetAllModulesResType,
  GetPermissionByIdResType,
  GetPermissionsResType,
  UpdatePermissionBodyType,
} from './permission.model'

@Injectable()
export class PermissionRepo {
  constructor(private prismaService: PrismaService) {}

  async listPermissions({
    limit,
    page,
  }: {
    limit: number
    page: number
    permissions?: string[]
  }): Promise<GetPermissionsResType> {
    const skip = (page - 1) * limit
    const take = limit

    let where: Prisma.PermissionWhereInput = {
      deletedAt: null,
    }
    const [totalItems, data] = await Promise.all([
      this.prismaService.permission.count({ where }),
      this.prismaService.permission.findMany({
        skip,
        take,
        where,
        orderBy: {
          //@ts-ignore
          createdAt: 'desc',
        },
        include: {
          roles: {
            select: {
              id: true,
              name: true,
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

  async createPermission(data: CreatePermissionBodyType) {
    return await this.prismaService.permission.create({
      data: {
        description: data.description ?? null,
        path: data.path,
        method: data.method,
        module: data.module,
      },
    })
  }

  async deletePermission({ id }: { id: string }) {
    return await this.prismaService.permission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async getPermissionById(id: string): Promise<GetPermissionByIdResType | null> {
    return this.prismaService.permission.findUnique({
      where: { id },
    })
  }

  async updatePermission(data: UpdatePermissionBodyType, id: string) {
    return await this.prismaService.permission.update({
      where: { id },
      data: {
        path: data.path,
        description: data.description ?? null,
        module: data.module,
        method: data.method,
      },
    })
  }

  async getAllModules(): Promise<GetAllModulesResType> {
    const modules = await this.prismaService.permission.findMany({
      where: { deletedAt: null },
      select: { module: true },
      distinct: ['module'],
    })

    return { data: modules }
  }
}
