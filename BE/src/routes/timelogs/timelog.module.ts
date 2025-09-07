import { Module } from '@nestjs/common'
import { TimeLogService } from './timelog.service'
import { TimeLogRepo } from './timelog.repo'
import { TimelogController } from './timelog.controller'

@Module({
  providers: [TimeLogService, TimeLogRepo],
  controllers: [TimelogController],
})
export class TimelogModule {}
