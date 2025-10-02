import { Logger } from '@nestjs/common'
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { TokenService } from 'src/shared/services/token.service'

@WebSocketGateway({ namespace: 'reminders' })
export class ReminderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  private readonly logger = new Logger(ReminderGateway.name)
  constructor(private readonly tokenService: TokenService) {}
  async handleConnection(socket: Socket) {
    const userId = socket.data?.userId
    if (!userId) return
    this.logger.log(`User ${userId} connected (socket: ${socket.id})`)
  }

  async handleDisconnect(socket: Socket) {
    const userId = socket.data?.userId
    if (!userId) return
    this.logger.log(`User ${userId} disconnected (socket: ${socket.id})`)
  }

  sendReminder(userId: string, payload: any) {
    if (userId) {
      this.server.to(userId).emit('reminder', payload)
    }
  }
}
