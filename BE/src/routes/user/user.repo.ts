import { Injectable } from '@nestjs/common'
import {
  CreateUserBodyType,
  GetUsersQueryType,
  GetUsersResType,
  RefreshTokenBodyType,
  RefreshTokenType,
  UpdateProfileResType,
  UpdateUserBodyType,
} from 'src/routes/user/user.model'
import { RoleType } from 'src/shared/models/shared-role.model'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

export type WhereUniqueUserType = { id: string } | { email: string }

@Injectable()
export class UserRepo {
  constructor(private prismaService: PrismaService) {}

  async list(pagination: GetUsersQueryType): Promise<GetUsersResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit

    const [totalItems, data] = await Promise.all([
      this.prismaService.user.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.user.findMany({
        skip,
        take,
        where: {
          deletedAt: null,
        },
        include: {
          role: true,
        },
      }),
    ])

    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit),
    }
  }

  async findUniqueUserIncludeRole(where: WhereUniqueUserType): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    })
  }

  createRefreshToken(data: { refreshToken: string; userId: string; expiredAt: Date }) {
    return this.prismaService.refreshToken.create({
      data,
    })
  }

  async findUniqueRefreshTokenIncludeUserRole(where: {
    refreshToken: string
  }): Promise<(RefreshTokenBodyType & { user: UserType & { role: RoleType } }) | null> {
    return this.prismaService.refreshToken.findUnique({
      where,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    })
  }

  deleteRefreshToken(where: { refreshToken: string }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where,
    })
  }

  createUser({ data }: { data: CreateUserBodyType }): Promise<UserType> {
    return this.prismaService.user.create({
      data: {
        ...data,
      },
    })
  }

  async updateUser(where: { id: string }, data: Omit<UpdateUserBodyType, 'refreshToken'>) {
    const { roleId, ...rest } = data

    return this.prismaService.user.update({
      where,
      data: {
        ...rest,
        ...(roleId ? { role: { connect: { id: roleId } } } : {}),
      },
      include: { role: true },
    })
  }

  deleteUser(
    {
      id,
    }: {
      id: string
    },
    isHard?: boolean,
  ): Promise<UserType> {
    return isHard
      ? this.prismaService.user.delete({
          where: {
            id,
          },
        })
      : this.prismaService.user.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        })
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })
    if (!user) return null
    return user
  }
}
