// notification.controller.ts
import { Controller, Delete, Get, Query } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { NotificationSchemaDTO } from './notification.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ZodSerializerDto(NotificationSchemaDTO)
  async getMyNotifications(@ActiveUser('userId') userId: string) {
    return this.notificationService.getMyNotifications(userId)
  }

  @Delete('clear-all')
  @ZodSerializerDto(MessageResDTO)
  clearAll(@ActiveUser('userId') userId: string) {
    return this.notificationService.clearAll(userId)
  }
}
