import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets'
import { ServerOptions, Socket } from 'socket.io'
import { MessageService } from './message.service'
import { Logger } from '@nestjs/common'
import { generateRoomUserId } from 'src/websockets/websocket.adapter'
import { CreateMessageBodySchema, CreateMessageBodyType } from './message.model'
import { MessageRepo } from './message.repo'

@WebSocketGateway({ namespace: 'messages' })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Socket
  private readonly logger = new Logger(MessageGateway.name)

  constructor(private readonly messageService: MessageRepo) {}

  async handleConnection(socket: Socket) {
    console.log(`🔌 Connected: ${socket.id}`)
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(` Disconnected: ${socket.id}`)
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(@MessageBody() payload: CreateMessageBodyType): Promise<CreateMessageBodyType> {
    const message = await this.messageService.createMessage(payload)
    console.log(message)

    const receiverRoom = generateRoomUserId(payload.receiverId)
    this.server.to(receiverRoom).emit('receive-message', message)

    this.server.to(receiverRoom).emit('receive-notification', {
      userId: message.receiverId,
      title: 'Tin nhắn mới',
      content: message.content,
      senderId: message.senderId,
    })

    return message
  }
}
