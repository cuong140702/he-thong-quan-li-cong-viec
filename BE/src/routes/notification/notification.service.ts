// notification.service.ts
import { Injectable } from '@nestjs/common'
import { NotificationRepo } from './notification.repo'

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepo) {}

  async getMyNotifications(userId: string) {
    return this.notificationRepo.getMyNotifications(userId)
  }

  async clearAll(userId: string) {
    try {
      await this.notificationRepo.clearAll(userId)
      return {
        message: 'Delete all successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async markAsRead({ id }: { id: string }) {
    try {
      await this.notificationRepo.markAsRead(id)
      return {
        message: 'Mark as read successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async markAllAsRead(userId: string) {
    try {
      await this.notificationRepo.markAllAsRead(userId)
      return {
        message: 'Mark all as read successfully',
      }
    } catch (error) {
      throw error
    }
  }
}
