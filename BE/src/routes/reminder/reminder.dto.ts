import { createZodDto } from 'nestjs-zod'
import {
  CreateReminderBodySchema,
  CreateReminderResSchema,
  GetRemindersQuerySchema,
  GetRemindersResSchema,
} from './reminder.model'

export class CreateReminderBodyDTO extends createZodDto(CreateReminderBodySchema) {}
export class CreateReminderResDTO extends createZodDto(CreateReminderResSchema) {}
export class GetRemindersResDTO extends createZodDto(GetRemindersResSchema) {}
export class GetRemindersQueryDTO extends createZodDto(GetRemindersQuerySchema) {}
