import z from 'zod'

export const MessageSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  content: z.string(),
  isRead: z.boolean().default(false),
  createdAt: z.date(),
})

export const CreateMessageBodySchema = MessageSchema.pick({
  senderId: true,
  receiverId: true,
  content: true,
})

export const GetMessagesParamsSchema = z.object({
  userId: z.string().uuid(),
})

export const CreateMessageResBodySchema = MessageSchema

export const GetMessagesBetweenUsersResSchema = z.array(MessageSchema)

export type MessageSchemaType = z.infer<typeof MessageSchema>
export type CreateMessageBodyType = z.infer<typeof CreateMessageBodySchema>
export type GetMessagesParamsType = z.infer<typeof GetMessagesParamsSchema>
export type CreateMessageResBodyType = z.infer<typeof CreateMessageResBodySchema>
export type GetMessagesBetweenUsersResSchemaType = z.infer<typeof GetMessagesBetweenUsersResSchema>
