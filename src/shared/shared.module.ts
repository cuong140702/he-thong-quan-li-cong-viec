import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'

const sharedServices = [PrismaService, HashingService, TokenService]

@Global()
@Module({
  providers: [...sharedServices],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
