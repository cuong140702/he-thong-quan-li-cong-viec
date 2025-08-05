import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateMessageBodyType, GetMessagesBetweenUsersResSchemaType } from './message.model'

@Injectable()
export class MessageRepo {
  constructor(private readonly prisma: PrismaService) {}
  async createMessage(data: CreateMessageBodyType) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
        },
        select: {
          id: true,
          content: true,
          senderId: true,
          receiverId: true,
        },
      })

      console.log('mmm', message)

      await tx.notification.create({
        data: {
          userId: message.receiverId,
          senderId: message.senderId,
          title: 'Tin nhắn mới',
          content: message.content,
        },
      })

      return message
    })
  }

  async getMessagesBetweenUsers(userA: string, userB: string): Promise<GetMessagesBetweenUsersResSchemaType> {
    return this.prisma.message.findMany({
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
  }
}
