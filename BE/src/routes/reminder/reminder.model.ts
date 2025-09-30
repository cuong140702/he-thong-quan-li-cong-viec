import z from 'zod'

export const ReminderSchema = z.object({
  id: z.string().uuid(),
  isSent: z.boolean().default(false),
  remindAt: z.date(),
  taskId: z.string().uuid(),
})

export const CreateReminderBodySchema = ReminderSchema.pick({
  taskId: true,
  remindAt: true,
}).strict()

export const CreateReminderResSchema = ReminderSchema

export const UpdateReminderBodySchema = CreateReminderBodySchema

export type CreateReminderBodyType = z.infer<typeof CreateReminderBodySchema>
export type CreateReminderResType = z.infer<typeof CreateReminderResSchema>
