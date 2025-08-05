// notification.service.ts
import { Injectable } from '@nestjs/common'
import { NotificationRepo } from './notification.repo'

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepo) {}

  async getMyNotifications(userId: string) {
    return this.notificationRepo.getMyNotifications(userId)
  }
}
