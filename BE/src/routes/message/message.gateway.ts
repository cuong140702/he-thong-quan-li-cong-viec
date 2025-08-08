import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { generateRoomUserId } from 'src/websockets/websocket.adapter'
import { CreateMessageBodyType } from './message.model'
import { MessageRepo } from './message.repo'
import { TokenService } from 'src/shared/services/token.service'

@WebSocketGateway({ namespace: 'messages' })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server // Đúng kiểu

  private readonly logger = new Logger(MessageGateway.name)

  constructor(
    private readonly messageRepo: MessageRepo,
    private readonly tokenService: TokenService,
  ) {}

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.authorization?.split(' ')[1]
    if (!token) return

    const { userId } = await this.tokenService.verifyAccessToken(token)
    // Join room theo userId
    socket.join(generateRoomUserId(userId))

    // Gửi thông báo cho tất cả client khác
    this.server.emit('user-status-changed', {
      userId,
      isOnline: true,
    })

    await this.messageRepo.setUserOnlineStatus(userId, true)
    this.logger.log(`User ${userId} connected`)
  }

  async handleDisconnect(socket: Socket) {
    const token = socket.handshake.auth.authorization?.split(' ')[1]
    if (!token) return

    const { userId } = await this.tokenService.verifyAccessToken(token)
    await this.messageRepo.setUserOnlineStatus(userId, false)
    await this.messageRepo.updateLastSeen(userId, new Date())
    this.server.emit('user-status-changed', {
      userId,
      isOnline: false,
      lastSeen: new Date(),
    })
    this.logger.log(`User ${userId} disconnected`)
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(@MessageBody() payload: CreateMessageBodyType): Promise<CreateMessageBodyType> {
    const message = await this.messageRepo.createMessage(payload)

    const receiverRoom = generateRoomUserId(payload.receiverId)
    this.server.to(receiverRoom).emit('receive-message', message)
    this.server.to(receiverRoom).emit('receive-notification', {
      userId: message.receiverId,
      title: 'Tin nhắn mới',
      content: `${message.sender.fullName} đã gửi tin nhắn cho bạn`,
      senderId: message.senderId,
      createdAt: message.createdAt,
    })

    return message
  }
}
