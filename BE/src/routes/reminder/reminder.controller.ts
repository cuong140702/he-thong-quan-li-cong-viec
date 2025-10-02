// reminder.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { ReminderService } from './reminder.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { CreateReminderBodyDTO, CreateReminderResDTO, GetRemindersQueryDTO, GetRemindersResDTO } from './reminder.dto'

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get()
  @ZodSerializerDto(GetRemindersResDTO)
  getReminders(@Query() query: GetRemindersQueryDTO) {
    return this.reminderService.getReminders({
      query,
    })
  }

  @Post()
  @ZodSerializerDto(CreateReminderResDTO)
  async createReminder(@Body() body: CreateReminderBodyDTO) {
    return this.reminderService.createReminder(body.taskId, new Date(body.remindAt))
  }
}
