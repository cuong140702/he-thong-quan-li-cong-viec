import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardRepo } from './dashboard.repo'
import { DashboardController } from './dashboard.controller'

@Module({
  providers: [DashboardService, DashboardRepo],
  controllers: [DashboardController],
})
export class DashboardModule {}
