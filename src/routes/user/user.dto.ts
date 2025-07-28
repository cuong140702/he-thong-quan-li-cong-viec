import { createZodDto } from 'nestjs-zod'
import {
  CreateUserBodySchema,
  CreateUserResSchema,
  GetUserParamsSchema,
  GetUsersQuerySchema,
  GetUsersResSchema,
  LoginBodySchema,
  LoginResSchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  UpdateUserBodySchema,
} from 'src/routes/user/user.model'

export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}

export class GetUsersQueryDTO extends createZodDto(GetUsersQuerySchema) {}

export class GetUserParamsDTO extends createZodDto(GetUserParamsSchema) {}

export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}

export class UpdateUserBodyDTO extends createZodDto(UpdateUserBodySchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResSchema) {}

export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}

export class CreateUserResDTO extends createZodDto(CreateUserResSchema) {}
