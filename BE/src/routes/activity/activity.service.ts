import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async logActivity(data: { userId?: string; action: string; module: string; details?: string }) {
    return this.prisma.activity.create({ data })
  }

  async getActivities(params: { userId?: string; module?: string; page?: number; limit?: number }) {
    const { userId, module, page = 1, limit = 20 } = params
    const skip = (page - 1) * limit

    const where: Prisma.ActivityWhereInput = {
      AND: [userId ? { userId } : {}, module ? { module: { contains: module } } : {}],
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true } } },
      }),
      this.prisma.activity.count({ where }),
    ])

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
