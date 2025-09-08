import { Injectable } from '@nestjs/common'
import { DashboardRepo } from './dashboard.repo'

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepo: DashboardRepo) {}

  async getDashboard() {
    return await this.dashboardRepo.getDashboard()
  }
}
