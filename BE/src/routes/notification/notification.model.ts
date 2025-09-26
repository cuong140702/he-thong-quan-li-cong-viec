import z from 'zod'

export const GetNotificationsQuery = z.object({
  userId: z.string().uuid(),
})

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string().nullable(),
  isRead: z.boolean(),
  createdAt: z.date(),
  userId: z.string().uuid(),
  senderId: z.string().uuid().nullable(),
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
