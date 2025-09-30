// reminder.service.ts
import { Injectable } from '@nestjs/common'
import { ReminderRepo } from './reminder.repo'

@Injectable()
export class ReminderService {
  constructor(private readonly reminderRepo: ReminderRepo) {}

  async createReminder(taskId: string, remindAt: Date) {
    return this.reminderRepo.createReminder(taskId, remindAt)
  }

  //   async checkReminders() {
  //     const reminders = await this.reminderRepo.findDueReminders()

  //     for (const r of reminders) {
  //       await this.notificationService.sendNotification({
  //         userId: r.task.userId,
  //         title: 'Task Reminder',
  //         content: `Nhắc nhở: ${r.task.title}`,
  //       })

  //       await this.reminderRepo.markAsSent(r.id)
  //     }
  //   }

  //   @Cron(CronExpression.EVERY_MINUTE)
  //   async handleCron() {
  //     await this.checkReminders()
  //   }
}
