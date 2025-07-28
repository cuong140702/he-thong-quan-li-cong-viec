import { Injectable } from '@nestjs/common'
import {
  CreateUserBodyType,
  GetUsersQueryType,
  GetUsersResType,
  RefreshTokenBodyType,
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
      this.prismaService.user.count({}),
      this.prismaService.user.findMany({
        skip,
        take,
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
      },
      include: {
        role: true,
      },
    })
  }

  createRefreshToken(data: { token: string; userId: string; expiredAt: Date }) {
    return this.prismaService.refreshToken.create({
      data,
    })
  }

  async findUniqueRefreshTokenIncludeUserRole(where: {
    token: string
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

  deleteRefreshToken(where: { token: string }) {
    return this.prismaService.refreshToken.delete({
      where,
    })
  }

  createUser({ data }: { data: CreateUserBodyType }) {
    return this.prismaService.user.create({
      data: {
        ...data,
      },
    })
  }
}
