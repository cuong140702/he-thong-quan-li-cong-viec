import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { Prisma } from '@prisma/client'
import { GetPermissionsResType } from './permission.model'

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
}
