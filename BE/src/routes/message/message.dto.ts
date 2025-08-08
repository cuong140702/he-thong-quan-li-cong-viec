import { createZodDto } from 'nestjs-zod'
import {
  CreateMessageBodySchema,
  CreateMessageResBodySchema,
  GetMessagesBetweenUsersResSchema,
  GetMessagesParamsSchema,
  GetUsersMessageResSchema,
  MessageSchema,
} from './message.model'
export class MessageSchemaDTO extends createZodDto(MessageSchema) {}
export class CreateMessageBodyDTO extends createZodDto(CreateMessageBodySchema) {}
export class GetMessagesParamsDTO extends createZodDto(GetMessagesParamsSchema) {}
export class CreateMessageResBodyDTO extends createZodDto(CreateMessageResBodySchema) {}
export class GetMessagesBetweenUsersResSchemaDTO extends createZodDto(GetMessagesBetweenUsersResSchema) {}
export class GetUsersMessageResDTO extends createZodDto(GetUsersMessageResSchema) {}
