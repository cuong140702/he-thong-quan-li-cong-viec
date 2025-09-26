import { createZodDto } from 'nestjs-zod'
import { GetNotificationParamsSchema, GetNotificationResSchema, GetNotificationsQuery } from './notification.model'

export class NotificationSchemaDTO extends createZodDto(GetNotificationResSchema) {}
export class GetNotificationsQueryDTO extends createZodDto(GetNotificationsQuery) {}
export class GetNotificationParamsDTO extends createZodDto(GetNotificationParamsSchema) {}
