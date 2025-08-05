import { Module } from '@nestjs/common'
import { NotificationRepo } from './notification.repo'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'

@Module({
  providers: [NotificationService, NotificationRepo],
  controllers: [NotificationController],
})
export class NotificationModule {}
