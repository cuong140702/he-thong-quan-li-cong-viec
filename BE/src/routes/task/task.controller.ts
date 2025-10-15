import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { TaskService } from './task.service'
import { GetTasksResSchema } from './task.model'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateTaskBodyDTO,
  CreateTaskResDTO,
  GetCalendarQueryDTO,
  GetCalendarResDTO,
  GetTaskByIdDTO,
  GetTaskParamsDTO,
  GetTasksQueryDTO,
  GetTasksResDTO,
  UpdateTaskBodyDTO,
  UpdateTaskResDTO,
} from './task.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'
import { RoleName } from 'src/shared/constants/role.constant'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ZodSerializerDto(GetTasksResDTO)
  list(@Query() query: GetTasksQueryDTO) {
    return this.taskService.listTasks({
      query,
    })
  }

  @Get('task-by-tag')
  @ZodSerializerDto(GetTasksResDTO)
  getTasksByTag(@Query() query: GetTasksQueryDTO) {
    return this.taskService.getTasksByTag({
      query,
    })
  }

  @Get('calendar')
  //@ZodSerializerDto(GetCalendarResDTO)
  async getCalendarTasks(@Query() query: GetCalendarQueryDTO, @ActiveUser() user?: AccessTokenPayload) {
    const isAdmin = user?.roleName === RoleName.Admin
    const userId = isAdmin ? query.userId : user?.userId
    return this.taskService.getTasksInRange({
      query,
      userId,
    })
  }

  @Get(':taskId')
  @ZodSerializerDto(GetTaskByIdDTO)
  getTaskById(@Param() params: GetTaskParamsDTO) {
    return this.taskService.getTaskById({
      id: params.taskId,
    })
  }

  @Post()
  @ZodSerializerDto(CreateTaskResDTO)
  create(@Body() body: CreateTaskBodyDTO, @ActiveUser('userId') userId: string) {
    return this.taskService.createTask({ data: body, userId })
  }

  @Put(':taskId')
  @ZodSerializerDto(UpdateTaskResDTO)
  updateTask(@Body() body: UpdateTaskBodyDTO, @Param() params: GetTaskParamsDTO) {
    return this.taskService.updateTask({
      data: body,
      id: String(params.taskId),
    })
  }

  @Delete(':taskId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetTaskParamsDTO) {
    return this.taskService.deleteTask({
      id: params.taskId,
    })
  }
}
