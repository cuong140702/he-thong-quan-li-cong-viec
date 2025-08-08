import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class NotificationRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getMyNotifications(userId: string) {
    const res = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { data: res }
  }
}
