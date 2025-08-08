import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateMessageBodyType, GetMessagesBetweenUsersResSchemaType } from './message.model'

@Injectable()
export class MessageRepo {
  constructor(private readonly prisma: PrismaService) {}
  async createMessage(data: CreateMessageBodyType) {
    return this.prisma.$transaction(async (tx) => {
      // Tạo message
      const message = await tx.message.create({
        data: {
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          createdAt: data.createdAt,
        },
        select: {
          id: true,
          content: true,
          senderId: true,
          receiverId: true,
          createdAt: true,
          sender: {
            select: {
              fullName: true,
            },
          },
        },
      })

      // Tạo notification
      await tx.notification.create({
        data: {
          userId: message.receiverId,
          senderId: message.senderId,
          title: 'Tin nhắn mới',
          content: `${message.sender.fullName} đã gửi tin nhắn cho bạn`,
        },
      })

      // Trả về message với user là sender
      return {
        ...message,
        user: message.sender,
      }
    })
  }

  async getMessagesBetweenUsers(userA: string, userB: string): Promise<GetMessagesBetweenUsersResSchemaType> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return {
      data: messages.map((msg) => ({
        ...msg,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
      })),
    }
  }

  async findAllExcluding(userId: string) {
    const messages = await this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
    })

    return { data: messages }
  }

  async setUserOnlineStatus(userId: string, status: boolean) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: status },
    })
  }

  async updateLastSeen(userId: string, time: Date) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastSeen: time },
    })
  }
}
