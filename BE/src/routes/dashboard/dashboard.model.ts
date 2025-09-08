import z from 'zod'

export const TaskDashboardSchema = z.object({
  totalTasks: z.number(),
  completedTasks: z.number(),
  weeklyHours: z.number(),
})

export type TaskDashboardType = z.infer<typeof TaskDashboardSchema>
