import { Injectable, NotFoundException } from '@nestjs/common'
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

  async clearAll(userId: string) {
    return await this.prisma.notification.updateMany({
      where: {
        userId: userId,
      },
      data: {
        //@ts-ignore
        deletedAt: new Date(),
      },
    })
  }

  async markAsRead(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })

    if (!notification) {
      throw new NotFoundException('Notification not found')
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
  }
}
