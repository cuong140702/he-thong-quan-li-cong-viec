import { GetTaskParamsSchema, taskSchema } from 'src/shared/models/shared-task.model'
import z from 'zod'

export const timelogSchema = z.object({
  id: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date().nullable().optional(),
  durationMinutes: z.number().int().nullable().optional(),
  note: z.string().nullable().optional(),
  createdAt: z.date(),

  taskId: z.string().uuid(),
})

export const GetTimelogParamsSchema = z
  .object({
    timelogId: z.string().uuid(),
  })
  .strict()

export const GetClockInResSchema = timelogSchema
  .pick({
    startTime: true,
  })
  .extend({
    task: taskSchema
      .pick({
        title: true,
        status: true,
      })
      .optional(),
  })

export const GetClockOutResSchema = timelogSchema
  .pick({
    endTime: true,
  })
  .extend({
    task: taskSchema
      .pick({
        title: true,
        status: true,
      })
      .optional(),
  })

export const createManualLogSchema = timelogSchema
  .pick({
    taskId: true,
    startTime: true,
    endTime: true,
    note: true,
    durationMinutes: true,
  })
  .strict()

export const ClockOutBodySchema = timelogSchema.pick({
  endTime: true,
})

export const CreateManualLogResSchema = timelogSchema

export const GetTimelogByTaskResSchema = z.object({
  data: z.array(timelogSchema),
})

export const GetTimelogByIdSchema = timelogSchema

export const GetTotalByTaskResSchema = z.object({
  taskId: z.string().uuid(),
  totalDurationMinutes: z.number().int(),
  totalLogs: z.number().int(),
})

export type GetClockInResType = z.infer<typeof GetClockInResSchema>
export type GetClockOutResType = z.infer<typeof GetClockOutResSchema>
export type CreateManualLogType = z.infer<typeof createManualLogSchema>
export type CreateManualLogResType = z.infer<typeof CreateManualLogResSchema>
export type GetTimelogByTaskResType = z.infer<typeof GetTimelogByTaskResSchema>
export type GetTimelogByIdType = z.infer<typeof GetTimelogByIdSchema>
export type GetTotalByTaskResType = z.infer<typeof GetTotalByTaskResSchema>
export type ClockOutBodyType = z.infer<typeof ClockOutBodySchema>
