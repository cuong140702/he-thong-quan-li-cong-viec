import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUsersQueryDTO,
  GetUsersResDTO,
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUsersResDTO)
  list(@Query() query: GetUsersQueryDTO) {
    return this.userService.list({
      page: query.page,
      limit: query.limit,
    })
  }

  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginResDTO)
  login(@Body() body: LoginBodyDTO) {
    return this.userService.login(body as { email: string; password: string })
  }

  @Post('refresh-token')
  @IsPublic()
  @ZodSerializerDto(RefreshTokenResDTO)
  refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return this.userService.refreshToken({
      token: body.refreshToken,
    })
  }

  @Post()
  @ZodSerializerDto(CreateUserResDTO)
  create(@Body() body: CreateUserBodyDTO) {
    return this.userService.createUser({ data: body })
  }
}
