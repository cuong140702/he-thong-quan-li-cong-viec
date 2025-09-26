// notification.controller.ts
import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { GetNotificationParamsDTO, NotificationSchemaDTO } from './notification.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
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

  @Patch(':notificationId/read')
  markAsRead(@Param() params: GetNotificationParamsDTO) {
    return this.notificationService.markAsRead({ id: String(params.notificationId) })
  }
}
