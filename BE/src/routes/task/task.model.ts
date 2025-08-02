import { TaskStatus } from 'src/shared/constants/task.constant'
import { TagSchema } from 'src/shared/models/shared-tag.model'
import z from 'zod'

// Base schema: dùng cho create/update
export const taskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  status: z.enum([TaskStatus.break, TaskStatus.completed, TaskStatus.in_progress]),
  deadline: z.coerce.date().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
})

export const GetTaskParamsSchema = z
  .object({
    taskId: z.string().uuid(),
  })
  .strict()

// Schema trả về từ DB (có id, createdAt,...)

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

// Schema khi tạo
export const CreateTaskBodySchema = taskSchema
  .extend({
    tags: z.array(z.string().uuid()).optional(),
  })
  .strict()

// Schema khi cập nhật
export const UpdateTaskBodySchema = CreateTaskBodySchema

export const CreateTaskResSchema = CreateTaskBodySchema

export const UpdateTaskResSchema = CreateTaskBodySchema

// Types
export type GetTasksResType = z.infer<typeof GetTasksResSchema>
export type GetTasksQueryType = z.infer<typeof GetTasksQuerySchema>
export type CreateTaskBodyType = z.infer<typeof CreateTaskBodySchema>
export type UpdateTaskBodyType = z.infer<typeof UpdateTaskBodySchema>
export type CreateTaskResType = z.infer<typeof CreateTaskResSchema>
export type UpdateTaskResType = z.infer<typeof UpdateTaskResSchema>
