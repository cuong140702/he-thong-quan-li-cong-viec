// reminder.module.ts
import { Module } from '@nestjs/common'
import { ReminderService } from './reminder.service'
import { ReminderController } from './reminder.controller'
import { ReminderGateway } from './reminder.gateway'
import { ReminderRepo } from './reminder.repo'

@Module({
  controllers: [ReminderController],
  providers: [ReminderService, ReminderGateway, ReminderRepo],
})
export class ReminderModule {}
