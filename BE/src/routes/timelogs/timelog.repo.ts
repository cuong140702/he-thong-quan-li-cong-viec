import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import {
  ClockOutBodyType,
  CreateManualLogResType,
  CreateManualLogType,
  GetClockInResType,
  GetClockOutResType,
  GetTimelogByIdType,
  GetTimelogByTaskResType,
  GetTotalByTaskResType,
} from './timelog.model'

@Injectable()
export class TimeLogRepo {
  constructor(private prismaService: PrismaService) {}

  async clockIn(id: string): Promise<GetClockInResType> {
    const task = await this.prismaService.task.findUnique({
      where: { id: id },
    })

    if (!task) throw new NotFoundException('Task not found')

    // tạo log mới và trả ra thông tin task
    const timeLog = await this.prismaService.timeLog.create({
      data: {
        taskId: id,
        startTime: new Date(),
      },
      include: {
        task: {
          select: {
            title: true,
            status: true,
          },
        },
      },
    })

    return {
      ...timeLog,
      task: timeLog.task,
    }
  }

  async clockOut(id: string): Promise<GetClockOutResType> {
    const log = await this.prismaService.timeLog.findUnique({ where: { id } })
    if (!log) throw new NotFoundException('TimeLog not found')
    const timeLog = await this.prismaService.timeLog.update({
      where: { id },
      data: { endTime: new Date() },
      include: {
        task: {
          select: {
            title: true,
            status: true,
          },
        },
      },
    })
    return {
      ...timeLog,
      task: timeLog.task,
    }
  }

  createManual(data: CreateManualLogType): Promise<CreateManualLogResType> {
    return this.prismaService.timeLog.create({
      data,
    })
  }

  async getLogsByTask(taskId: string): Promise<GetTimelogByTaskResType> {
    const logs = await this.prismaService.timeLog.findMany({
      where: { taskId, deletedAt: null },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        durationMinutes: true,
        note: true,
        createdAt: true,
        taskId: true,
      },
    })

    return { data: logs }
  }

  getById(id: string): Promise<GetTimelogByIdType | null> {
    return this.prismaService.timeLog.findUnique({ where: { id } })
  }

  deleteTimelog(id: string) {
    return this.prismaService.timeLog.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async totalByTask(taskId: string, startTime: Date): Promise<GetTotalByTaskResType> {
    const log = await this.prismaService.timeLog.findFirst({
      where: {
        taskId,
        startTime,
      },
    })

    if (!log || !log.startTime || !log.endTime) {
      throw new NotFoundException('No completed timelog found for this task')
    }

    const duration = (log.endTime.getTime() - log.startTime.getTime()) / 1000 / 60
    const roundedDuration = Math.round(duration)

    // Update durationMinutes cho log này
    await this.prismaService.timeLog.update({
      where: { id: log.id },
      data: { durationMinutes: roundedDuration },
    })

    return {
      taskId,
      totalDurationMinutes: roundedDuration,
      totalLogs: 1,
    }
  }
}
