// reminder.controller.ts
import { Controller, Post, Body, Get, Query, Delete, Param } from '@nestjs/common'
import { ReminderService } from './reminder.service'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateReminderBodyDTO,
  CreateReminderResDTO,
  GetReminderParamsDTO,
  GetRemindersQueryDTO,
  GetRemindersResDTO,
} from './reminder.dto'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

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

  @Delete(':reminderId')
  @ZodSerializerDto(MessageResDTO)
  deleteReminder(@Param() params: GetReminderParamsDTO) {
    return this.reminderService.deleteReminder({
      id: params.reminderId,
    })
  }
}
