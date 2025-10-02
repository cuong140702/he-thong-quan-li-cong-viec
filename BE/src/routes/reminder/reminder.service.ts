// reminder.service.ts
import { Injectable } from '@nestjs/common'
import { ReminderRepo } from './reminder.repo'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ReminderGateway } from './reminder.gateway'
import { GetRemindersQueryType } from './reminder.model'

@Injectable()
export class ReminderService {
  constructor(
    private readonly reminderRepo: ReminderRepo,
    private reminderGateway: ReminderGateway,
  ) {}

  async getReminders(props: { query: GetRemindersQueryType }) {
    return await this.reminderRepo.getReminders(props.query)
  }

  async createReminder(taskId: string, remindAt: Date) {
    return this.reminderRepo.createReminder(taskId, remindAt)
  }

  async checkReminders() {
    const reminders = await this.reminderRepo.findDueReminders()

    for (const r of reminders) {
      await this.reminderRepo.sendNotification({
        userId: r.task.userId,
        title: 'Task Reminder',
        content: `Nhắc nhở: ${r.task.title}`,
        senderId: null,
      })

      // Gửi realtime qua WebSocket
      this.reminderGateway.sendReminder(r?.task?.userId, {
        title: 'Task Reminder',
        content: `Nhắc nhở: ${r?.task?.title}`,
      })

      await this.reminderRepo.markAsSent(r.id)
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.checkReminders()
  }
}
