import { createZodDto } from 'nestjs-zod'
import {
  CreateTaskBodySchema,
  CreateTaskResSchema,
  GetTaskParamsSchema,
  GetTasksQuerySchema,
  GetTasksResSchema,
  UpdateTaskBodySchema,
  UpdateTaskResSchema,
} from './task.model'

export class GetTasksResDTO extends createZodDto(GetTasksResSchema) {}
export class GetTasksQueryDTO extends createZodDto(GetTasksQuerySchema) {}
export class CreateTaskBodyDTO extends createZodDto(CreateTaskBodySchema) {}
export class UpdateTaskBodyDTO extends createZodDto(UpdateTaskBodySchema) {}

export class CreateTaskResDTO extends createZodDto(CreateTaskResSchema) {}
export class UpdateTaskResDTO extends createZodDto(UpdateTaskResSchema) {}
export class GetTaskParamsDTO extends createZodDto(GetTaskParamsSchema) {}
