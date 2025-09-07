import { createZodDto } from 'nestjs-zod'
import { GetTaskParamsSchema } from 'src/shared/models/shared-task.model'
import {
  ClockOutBodySchema,
  CreateManualLogResSchema,
  createManualLogSchema,
  GetClockInResSchema,
  GetClockOutResSchema,
  GetTimelogByIdSchema,
  GetTimelogByTaskResSchema,
  GetTimelogParamsSchema,
  GetTotalByTaskResSchema,
} from './timelog.model'

export class ClockInBodyDTO extends createZodDto(GetTaskParamsSchema) {}
export class ClockOutBodyDTO extends createZodDto(ClockOutBodySchema) {}
export class GetClockInResDTO extends createZodDto(GetClockInResSchema) {}
export class GetClockOutResDTO extends createZodDto(GetClockOutResSchema) {}
export class GetTimelogParamsDTO extends createZodDto(GetTimelogParamsSchema) {}
export class CreateManualLogDTO extends createZodDto(createManualLogSchema) {}
export class CreateManualLogResDTO extends createZodDto(CreateManualLogResSchema) {}
export class GetTimelogByTaskResDTO extends createZodDto(GetTimelogByTaskResSchema) {}
export class GetTimelogByIdResDTO extends createZodDto(GetTimelogByIdSchema) {}
export class GetTotalByTaskResDTO extends createZodDto(GetTotalByTaskResSchema) {}
