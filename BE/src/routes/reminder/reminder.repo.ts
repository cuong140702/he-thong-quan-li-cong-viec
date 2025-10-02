import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateReminderResType, CreateSendNotificationType, GetRemindersQueryType } from './reminder.model'

@Injectable()
export class ReminderRepo {
  constructor(private readonly prisma: PrismaService) {}

  createReminder(taskId: string, remindAt: Date): Promise<CreateReminderResType> {
    return this.prisma.reminder.create({
      data: {
        taskId,
        remindAt,
      },
    })
  }

  sendNotification(data: CreateSendNotificationType) {
    // 1. Lưu DB
    const notification = this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        senderId: data.senderId,
      },
    })

    return notification
  }

  findDueReminders() {
    const now = new Date()
    return this.prisma.reminder.findMany({
      where: {
        remindAt: { lte: now },
        isSent: false,
      },
      include: { task: { include: { user: true } } },
    })
  }

  markAsSent(id: string) {
    return this.prisma.reminder.update({
      where: { id },
      data: { isSent: true },
    })
  }

  async getReminders(query: GetRemindersQueryType) {
    const { page = 1, limit = 10 } = query
    const skip = (page - 1) * limit

    const where = {
      deletedAt: null,
    }

    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.reminder.findMany({
        //@ts-ignore
        where,
        skip,
        take: limit,
        include: {
          task: {
            select: {
              title: true,
              status: true,
            },
          },
        },
      }),
      //@ts-ignore
      this.prisma.reminder.count({ where }),
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
