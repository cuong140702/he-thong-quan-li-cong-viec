import { createZodDto } from 'nestjs-zod'
import { CreateReminderBodySchema, CreateReminderResSchema } from './reminder.model'

export class CreateReminderBodyDTO extends createZodDto(CreateReminderBodySchema) {}
export class CreateReminderResDTO extends createZodDto(CreateReminderResSchema) {}
