import { createZodDto } from 'nestjs-zod'
import {
  CreateProjectBodySchema,
  GetProjectByIdResSchema,
  GetProjectParamsSchema,
  GetProjectsQuerySchema,
  GetProjectsResSchema,
  projectSchema,
  UpdateProjectBodySchema,
} from './project.model'

export class CreateProjectBodyDTO extends createZodDto(CreateProjectBodySchema) {}
export class UpdateProjectBodyDTO extends createZodDto(UpdateProjectBodySchema) {}
export class GetProjectsResDTO extends createZodDto(GetProjectsResSchema) {}
export class GetProjecyQueryDTO extends createZodDto(GetProjectsQuerySchema) {}
export class GetProjectParamsDTO extends createZodDto(GetProjectParamsSchema) {}
export class CreateProjectResDTO extends createZodDto(projectSchema) {}
export class UpdateProjectResDTO extends createZodDto(projectSchema) {}
export class GetProjectByIdResDTO extends createZodDto(GetProjectByIdResSchema) {}
