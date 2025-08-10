import { taskSchema } from 'src/shared/models/shared-task.model'
import { UserSchema } from 'src/shared/models/shared-user.model'
import z from 'zod'

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

export const GetProjectsResSchema = z.object({
  data: z.array(
    projectSchema.extend({
      user: UserSchema.pick({
        id: true,
        fullName: true,
      }).optional(),
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

export const GetProjectByIdResSchema = projectSchema.extend({
  user: UserSchema.pick({
    id: true,
    fullName: true,
  }).optional(),
  tasks: z
    .array(
      taskSchema.pick({
        title: true,
        status: true,
      }),
    )
    .optional(),
})

export const GetProjectsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict()

export const CreateProjectBodySchema = projectSchema
  .pick({
    name: true,
    description: true,
    userId: true,
  })
  .strict()

export const GetProjectParamsSchema = z
  .object({
    projectId: z.string().uuid(),
  })
  .strict()

export const UpdateProjectBodySchema = CreateProjectBodySchema

export type CreateProjectBodyType = z.infer<typeof CreateProjectBodySchema>
export type UpdateProjectBodyType = z.infer<typeof UpdateProjectBodySchema>
export type GetProjectsResType = z.infer<typeof GetProjectsResSchema>
export type GetProjectQueryType = z.infer<typeof GetProjectsQuerySchema>
export type GetProjectParamsType = z.infer<typeof GetProjectParamsSchema>
export type GetProjectByIdResType = z.infer<typeof GetProjectByIdResSchema>
