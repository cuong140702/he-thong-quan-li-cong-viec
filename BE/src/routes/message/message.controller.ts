import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { CreateMessageBodyDTO, CreateMessageResBodyDTO, GetMessagesBetweenUsersResSchemaDTO } from './message.dto'
import { MessageService } from './message.service'

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ZodSerializerDto(CreateMessageResBodyDTO)
  createMessage(@Body() body: CreateMessageBodyDTO) {
    return this.messageService.createMessage({ data: body })
  }

  @Get('between')
  @ZodSerializerDto(GetMessagesBetweenUsersResSchemaDTO)
  getMessagesBetweenUsers(@Query('user1') user1: string, @Query('user2') user2: string) {
    return this.messageService.getMessagesBetweenUsers(user1, user2)
  }
}
