import { createZodDto } from 'nestjs-zod'
import { TaskDashboardSchema } from './dashboard.model'

export class TaskDashboardDTO extends createZodDto(TaskDashboardSchema) {}
