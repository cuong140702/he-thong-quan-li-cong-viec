// reminder.controller.ts
import { Controller, Post, Body } from '@nestjs/common'
import { ReminderService } from './reminder.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { CreateReminderBodyDTO, CreateReminderResDTO } from './reminder.dto'

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  @ZodSerializerDto(CreateReminderResDTO)
  async createReminder(@Body() body: CreateReminderBodyDTO) {
    return this.reminderService.createReminder(body.taskId, new Date(body.remindAt))
  }
}
