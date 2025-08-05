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

export type NotificationSchemaType = z.infer<typeof NotificationSchema>
export type GetNotificationsQueryType = z.infer<typeof GetNotificationsQuery>
