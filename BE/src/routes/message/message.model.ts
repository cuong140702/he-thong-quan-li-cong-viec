import { UserSchema } from 'src/shared/models/shared-user.model'
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
  createdAt: true,
})

export const GetMessagesParamsSchema = z.object({
  userId: z.string().uuid(),
})

export const CreateMessageResBodySchema = MessageSchema.extend({
  user: UserSchema.pick({
    fullName: true,
  }),
})

export const GetMessagesBetweenUsersResSchema = z.object({ data: z.array(MessageSchema) })

export const GetUsersMessageResSchema = z.object({
  data: z.array(UserSchema.omit({ password: true })),
})

export type MessageSchemaType = z.infer<typeof MessageSchema>
export type CreateMessageBodyType = z.infer<typeof CreateMessageBodySchema>
export type GetMessagesParamsType = z.infer<typeof GetMessagesParamsSchema>
export type CreateMessageResBodyType = z.infer<typeof CreateMessageResBodySchema>
export type GetMessagesBetweenUsersResSchemaType = z.infer<typeof GetMessagesBetweenUsersResSchema>
