import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { ActivityService } from './activity.service'
import { Request } from 'express'

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get()
  async getMyActivities(
    @Req() req: Request,
    @Query('module') module?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const user = req['user'] // từ token
    return this.activityService.getActivities({
      userId: user.id,
      module,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    })
  }
}
