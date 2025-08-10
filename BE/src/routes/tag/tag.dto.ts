import { createZodDto } from 'nestjs-zod'
import {
  CreateTagBodySchema,
  GetTagByIdResSchema,
  GetTagParamsSchema,
  GetTagQuerySchema,
  GetTagsResSchema,
  UpdateTagBodySchema,
} from './tag.model'
import { TagSchema } from 'src/shared/models/shared-tag.model'

export class CreateTagBodyDTO extends createZodDto(CreateTagBodySchema) {}
export class UpdateTagBodyDTO extends createZodDto(UpdateTagBodySchema) {}
export class GetTagsResDTO extends createZodDto(GetTagsResSchema) {}
export class GetTagQueryDTO extends createZodDto(GetTagQuerySchema) {}
export class GetTagParamsDTO extends createZodDto(GetTagParamsSchema) {}
export class CreateTagResDTO extends createZodDto(TagSchema) {}
export class UpdateTagResDTO extends createZodDto(TagSchema) {}
export class GetTagByIdResDTO extends createZodDto(GetTagByIdResSchema) {}
