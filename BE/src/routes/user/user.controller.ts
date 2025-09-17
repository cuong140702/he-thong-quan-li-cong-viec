import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUserByIdDTO,
  GetUserParamsDTO,
  GetUsersQueryDTO,
  GetUsersResDTO,
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  UpdateProfileResDTO,
  UpdateUserBodyDTO,
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('user')
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
      refreshToken: body.refreshToken,
    })
  }

  @Post()
  @ZodSerializerDto(CreateUserResDTO)
  create(@Body() body: CreateUserBodyDTO) {
    return this.userService.createUser({ data: body })
  }

  @Post('logout')
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: LogoutBodyDTO) {
    return this.userService.logout(body.refreshToken)
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID của người dùng cần cập nhật',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ZodSerializerDto(UpdateProfileResDTO)
  updateUser(@Body() body: UpdateUserBodyDTO, @Param() params: GetUserParamsDTO) {
    return this.userService.updateUser({
      data: body,
      id: String(params.userId),
    })
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserByIdDTO)
  getUserById(@Param() params: GetUserParamsDTO) {
    return this.userService.getUserById({
      id: params.userId,
    })
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetUserParamsDTO) {
    return this.userService.deleteUser({
      id: params.userId,
    })
  }
}
