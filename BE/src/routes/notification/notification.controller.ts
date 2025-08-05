// notification.controller.ts
import { Controller, Get, Query } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { NotificationSchemaDTO } from './notification.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(NotificationSchemaDTO)
  async getMyNotifications(@ActiveUser('userId') userId: string) {
    return this.notificationService.getMyNotifications(userId)
  }
}
