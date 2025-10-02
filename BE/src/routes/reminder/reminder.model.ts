import { NotificationSchema } from 'src/shared/models/shared-notification.model'
import { taskSchema } from 'src/shared/models/shared-task.model'
import z from 'zod'

export const ReminderSchema = z.object({
  id: z.string().uuid(),
  isSent: z.boolean().default(false),
  remindAt: z.date(),
  taskId: z.string().uuid(),
})

export const GetRemindersResSchema = z.object({
  data: z.array(
    ReminderSchema.extend({
      task: taskSchema
        .pick({
          title: true,
          status: true,
        })
        .optional(),
    }),
  ),
  totalItems: z.number(),
  page: z.number(), // Số trang hiện tại
  limit: z.number(), // Số item trên 1 trang
  totalPages: z.number(), // Tổng số trang
})

export const GetRemindersQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict()

export const CreateReminderBodySchema = ReminderSchema.pick({
  taskId: true,
  remindAt: true,
}).strict()

export const CreateSendNotificationSchema = NotificationSchema.pick({
  userId: true,
  title: true,
  content: true,
  senderId: true,
}).strict()

export const CreateReminderResSchema = ReminderSchema

export const UpdateReminderBodySchema = CreateReminderBodySchema

export type CreateReminderBodyType = z.infer<typeof CreateReminderBodySchema>
export type CreateReminderResType = z.infer<typeof CreateReminderResSchema>
export type CreateSendNotificationType = z.infer<typeof CreateSendNotificationSchema>
export type GetRemindersResType = z.infer<typeof GetRemindersResSchema>
export type GetRemindersQueryType = z.infer<typeof GetRemindersQuerySchema>
