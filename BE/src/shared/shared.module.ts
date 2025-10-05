import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-token.guard'
import { AuthenticationGuard } from './guards/authentication.guard'
import { SharedWebsocketRepository } from './repositories/shared-websocket.repo'
import { ActivityMiddleware } from './middlewares/activity.middleware'
import { ActivityModule } from 'src/routes/activity/activity.module'

const sharedServices = [PrismaService, HashingService, TokenService, SharedWebsocketRepository, ActivityMiddleware]

@Global()
@Module({
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedServices,
  imports: [JwtModule, ActivityModule],
})
export class SharedModule {}
