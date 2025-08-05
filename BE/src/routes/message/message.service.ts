import { Injectable } from '@nestjs/common'
import { CreateMessageBodyType } from './message.model'
import { MessageRepo } from './message.repo'
@Injectable()
export class MessageService {
  constructor(private readonly messageRepo: MessageRepo) {}

  async createMessage({ data }: { data: CreateMessageBodyType }) {
    return await this.messageRepo.createMessage(data)
  }

  async getMessagesBetweenUsers(user1: string, user2: string) {
    return await this.messageRepo.getMessagesBetweenUsers(user1, user2)
  }
}
