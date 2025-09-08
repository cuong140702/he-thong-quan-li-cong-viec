import { Controller, Get } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { TaskDashboardDTO } from './dashboard.dto'
import { DashboardService } from './dashboard.service'
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller('dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ZodSerializerDto(TaskDashboardDTO)
  getDashboard() {
    return this.dashboardService.getDashboard()
  }
}
