import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { ActivityService } from 'src/routes/activity/activity.service'
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'

@Injectable()
export class ActivityMiddleware implements NestMiddleware {
  constructor(private readonly activityService: ActivityService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      try {
        const user = req[REQUEST_USER_KEY]
        if (user && req.method !== 'GET') {
          await this.activityService.logActivity({
            userId: user.userId,
            action: req.method,
            module: req.originalUrl.split('/')[1].toUpperCase(),
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
