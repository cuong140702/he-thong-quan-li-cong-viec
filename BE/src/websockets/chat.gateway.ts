import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server
}
