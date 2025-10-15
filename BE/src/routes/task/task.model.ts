import { TagSchema } from 'src/shared/models/shared-tag.model'
import { taskSchema } from 'src/shared/models/shared-task.model'
import z from 'zod'

// Response từ API
export const GetTasksResSchema = z.object({
  data: z.array(
    taskSchema.extend({
      tags: z.array(TagSchema).optional(),
    }),
  ),
  totalItems: z.number(),
  page: z.number(), // Số trang hiện tại
  limit: z.number(), // Số item trên 1 trang
  totalPages: z.number(), // Tổng số trang
})

// Query schema
export const GetTasksQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    tags: z
      .preprocess((value) => {
        if (typeof value === 'string') {
          return [value]
        }
        return value
      }, z.array(z.string().uuid()))
      .optional(),
  })
  .strict()

export const GetCalendarQuerySchema = taskSchema
  .pick({
    startDate: true,
    deadline: true,
    projectId: true,
  })
  .extend({
    userId: z.string().uuid().optional(),
  })

// Schema khi tạo
export const CreateTaskBodySchema = taskSchema
  .pick({
    title: true,
    description: true,
    status: true,
    startDate: true,
    deadline: true,
    projectId: true,
  })
  .extend({
    tags: z.array(z.string().uuid()).optional(),
  })

// Schema khi cập nhật
export const UpdateTaskBodySchema = CreateTaskBodySchema

export const CreateTaskResSchema = CreateTaskBodySchema

export const UpdateTaskResSchema = CreateTaskBodySchema

export const GetTaskByIdSchema = taskSchema.extend({
  tags: z.array(TagSchema).optional(),
})

// Types
export type GetTasksResType = z.infer<typeof GetTasksResSchema>
export type GetTasksQueryType = z.infer<typeof GetTasksQuerySchema>
export type CreateTaskBodyType = z.infer<typeof CreateTaskBodySchema>
export type UpdateTaskBodyType = z.infer<typeof UpdateTaskBodySchema>
export type CreateTaskResType = z.infer<typeof CreateTaskResSchema>
export type UpdateTaskResType = z.infer<typeof UpdateTaskResSchema>
export type GetCalendarQueryType = z.infer<typeof GetCalendarQuerySchema>
