import { Module } from '@nestjs/common'
import { MessageController } from './message.controller'
import { MessageService } from './message.service'
import { MessageRepo } from './message.repo'
import { MessageGateway } from './message.gateway'

@Module({
  providers: [MessageService, MessageRepo, MessageGateway],
  controllers: [MessageController],
})
export class MessageModule {}
