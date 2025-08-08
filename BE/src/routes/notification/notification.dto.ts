import { createZodDto } from 'nestjs-zod'
import { GetNotificationResSchema, GetNotificationsQuery } from './notification.model'

export class NotificationSchemaDTO extends createZodDto(GetNotificationResSchema) {}
export class GetNotificationsQueryDTO extends createZodDto(GetNotificationsQuery) {}
