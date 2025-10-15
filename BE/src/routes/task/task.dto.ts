import { createZodDto } from 'nestjs-zod'
import {
  CreateTaskBodySchema,
  CreateTaskResSchema,
  GetCalendarQuerySchema,
  GetCalendarResSchema,
  GetTaskByIdSchema,
  GetTasksQuerySchema,
  GetTasksResSchema,
  UpdateTaskBodySchema,
  UpdateTaskResSchema,
} from './task.model'
import { GetTaskParamsSchema } from 'src/shared/models/shared-task.model'

export class GetTasksResDTO extends createZodDto(GetTasksResSchema) {}
export class GetTasksQueryDTO extends createZodDto(GetTasksQuerySchema) {}
export class GetTaskByIdDTO extends createZodDto(GetTaskByIdSchema) {}
export class GetCalendarQueryDTO extends createZodDto(GetCalendarQuerySchema) {}
export class CreateTaskBodyDTO extends createZodDto(CreateTaskBodySchema) {}
export class UpdateTaskBodyDTO extends createZodDto(UpdateTaskBodySchema) {}

export class CreateTaskResDTO extends createZodDto(CreateTaskResSchema) {}
export class UpdateTaskResDTO extends createZodDto(UpdateTaskResSchema) {}
export class GetCalendarResDTO extends createZodDto(GetCalendarResSchema) {}
export class GetTaskParamsDTO extends createZodDto(GetTaskParamsSchema) {}
