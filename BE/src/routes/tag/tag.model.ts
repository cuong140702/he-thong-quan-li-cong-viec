import { TagSchema } from 'src/shared/models/shared-tag.model'
import z from 'zod'

export const GetTagsResSchema = z.object({
  data: z.array(TagSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export const GetTagByIdResSchema = TagSchema

export const GetTagQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict()

export const CreateTagBodySchema = TagSchema.pick({
  name: true,
}).strict()

export const GetTagParamsSchema = z
  .object({
    tagId: z.string().uuid(),
  })
  .strict()

export const UpdateTagBodySchema = CreateTagBodySchema

export type CreateTagBodyType = z.infer<typeof CreateTagBodySchema>
export type UpdateTagBodyType = z.infer<typeof UpdateTagBodySchema>
export type GetTagsResType = z.infer<typeof GetTagsResSchema>
export type GetTagQueryType = z.infer<typeof GetTagQuerySchema>
export type GetPTagParamsType = z.infer<typeof GetTagParamsSchema>
export type GetTagByIdResType = z.infer<typeof GetTagByIdResSchema>
