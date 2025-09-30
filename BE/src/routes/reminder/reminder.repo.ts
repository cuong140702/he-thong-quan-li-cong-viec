import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateReminderResType } from './reminder.model'

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
}
