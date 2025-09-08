import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TaskDashboardType } from './dashboard.model'
import { TaskStatus } from '@prisma/client'

@Injectable()
export class DashboardRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(): Promise<TaskDashboardType> {
    const totalTasks = await this.prisma.task.count()
    const completedTasks = await this.prisma.task.count({
      where: { status: TaskStatus.completed },
    })

    // Tính tổng số giờ trong tuần này
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // Chủ nhật
    startOfWeek.setHours(0, 0, 0, 0)

    const weeklyMinutes = await this.prisma.timeLog.aggregate({
      _sum: { durationMinutes: true },
      where: { createdAt: { gte: startOfWeek }, deletedAt: null },
    })

    return {
      totalTasks,
      completedTasks,
      weeklyHours: Math.floor((weeklyMinutes._sum.durationMinutes || 0) / 60),
    }
  }
}
