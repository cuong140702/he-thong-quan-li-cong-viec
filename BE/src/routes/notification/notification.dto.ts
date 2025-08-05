import { createZodDto } from 'nestjs-zod'
import { GetNotificationsQuery, NotificationSchema } from './notification.model'

export class NotificationSchemaDTO extends createZodDto(NotificationSchema) {}
export class GetNotificationsQueryDTO extends createZodDto(GetNotificationsQuery) {}
