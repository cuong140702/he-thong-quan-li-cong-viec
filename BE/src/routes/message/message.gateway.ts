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
import { CreateMessageBodyType } from './message.model'
import { MessageRepo } from './message.repo'

@WebSocketGateway({ namespace: 'messages' })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  private readonly logger = new Logger(MessageGateway.name)

  constructor(private readonly messageRepo: MessageRepo) {}

  async handleConnection(socket: Socket) {
    const userId = socket.data?.userId

    if (!userId) return

    // User online
    await this.messageRepo.setUserOnlineStatus(userId, true)

    this.server.to(userId).emit('user-status-changed', {
      userId,
      isOnline: true,
    })

    this.logger.log(`User ${userId} connected (socket: ${socket.id})`)
  }

  async handleDisconnect(socket: Socket) {
    const userId = socket.data?.userId
    if (!userId) return

    // User offline + update last seen
    await this.messageRepo.setUserOnlineStatus(userId, false)
    await this.messageRepo.updateLastSeen(userId, new Date())

    this.server.to(userId).emit('user-status-changed', {
      userId,
      isOnline: false,
      lastSeen: new Date(),
    })

    this.logger.log(`User ${userId} disconnected (socket: ${socket.id})`)
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(@MessageBody() payload: CreateMessageBodyType): Promise<CreateMessageBodyType> {
    if (!payload.type) payload.type = 'text'

    const message = await this.messageRepo.createMessage(payload)

    // Emit cho cả 2 phòng (receiver + sender)
    this.server.to(message.receiverId).emit('receive-message', message)
    this.server.to(message.senderId).emit('message-sent', message)

    // Emit notification cho receiver
    this.server.to(message.receiverId).emit('receive-notification', {
      userId: message.receiverId,
      title: 'Tin nhắn mới',
      content: `${message.sender.fullName} đã gửi tin nhắn cho bạn`,
      senderId: message.senderId,
      createdAt: message.createdAt,
    })

    return message
  }
}
