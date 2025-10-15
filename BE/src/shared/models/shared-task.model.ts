import z from 'zod'
import { TaskStatus } from '../constants/task.constant'

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  status: z.enum([TaskStatus.break, TaskStatus.completed, TaskStatus.in_progress]),
  startDate: z.coerce.date().nullable().optional(),
  deadline: z.coerce.date().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
})

export const GetTaskParamsSchema = z
  .object({
    taskId: z.string().uuid(),
  })
  .strict()
