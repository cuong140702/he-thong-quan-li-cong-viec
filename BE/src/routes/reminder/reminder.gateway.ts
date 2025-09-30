import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway({ namespace: 'reminders' })
export class ReminderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  async handleConnection() {}
  async handleDisconnect() {}

  // Hàm này để ReminderService gọi
  //   sendReminder(userId: string, payload: any) {
  //     const socketId = this.clients.get(userId)
  //     if (socketId) {
  //       this.server.to(socketId).emit('reminder', payload)
  //     }
  //   }
}
