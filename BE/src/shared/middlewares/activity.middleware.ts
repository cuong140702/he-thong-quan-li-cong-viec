import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { ActivityService } from 'src/routes/activity/activity.service'

@Injectable()
export class ActivityMiddleware implements NestMiddleware {
  constructor(private readonly activityService: ActivityService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      try {
        const user = req['user']
        if (user && req.method !== 'GET') {
          await this.activityService.logActivity({
            userId: user.userId,
            action: req.method,
            module: (req.baseUrl.replace('/', '') || req.originalUrl.split('/')[1] || 'unknown').toUpperCase(),
            details: `${req.method} ${req.originalUrl}`,
          })
        }
      } catch (err) {
        console.error('Error logging activity:', err)
      }
    })
    next()
  }
}
