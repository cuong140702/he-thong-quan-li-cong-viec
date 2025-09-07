import { Injectable } from '@nestjs/common'
import { TimeLogRepo } from './timelog.repo'
import { ClockOutBodyType, CreateManualLogType } from './timelog.model'
@Injectable()
export class TimeLogService {
  constructor(private readonly timeLogRepo: TimeLogRepo) {}

  async clockIn({ id }: { id: string }) {
    return await this.timeLogRepo.clockIn(id)
  }

  async clockOut(props: { timelogId: string }) {
    return await this.timeLogRepo.clockOut(props.timelogId)
  }

  async createManual(data: CreateManualLogType) {
    return await this.timeLogRepo.createManual(data)
  }

  async getLogsByTask({ id }: { id: string }) {
    return await this.timeLogRepo.getLogsByTask(id)
  }

  async getById({ id }: { id: string }) {
    return await this.timeLogRepo.getById(id)
  }

  async deleteTimelog({ id }: { id: string }) {
    try {
      await this.timeLogRepo.deleteTimelog(id)
      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async totalByTask(taskId: string, startTime: Date) {
    return await this.timeLogRepo.totalByTask(taskId, startTime)
  }
}
