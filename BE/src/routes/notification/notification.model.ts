import { NotificationSchema } from 'src/shared/models/shared-notification.model'
import z from 'zod'

export const GetNotificationsQuery = z.object({
  userId: z.string().uuid(),
})

export const GetNotificationResSchema = z.object({
  data: z.array(NotificationSchema),
})

export const GetNotificationParamsSchema = z
  .object({
    notificationId: z.string().uuid(),
  })
  .strict()

export type NotificationSchemaType = z.infer<typeof GetNotificationResSchema>
export type GetNotificationsQueryType = z.infer<typeof GetNotificationsQuery>
export type GetNotificationParamsType = z.infer<typeof GetNotificationParamsSchema>
