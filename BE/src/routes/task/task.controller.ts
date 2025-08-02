import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { TaskService } from './task.service'
import { GetTasksResSchema } from './task.model'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateTaskBodyDTO,
  CreateTaskResDTO,
  GetTaskParamsDTO,
  GetTasksQueryDTO,
  GetTasksResDTO,
  UpdateTaskBodyDTO,
  UpdateTaskResDTO,
} from './task.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

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

  @Get()
  @ZodSerializerDto(GetTasksResDTO)
  getTasksByTag(@Query() query: GetTasksQueryDTO) {
    return this.taskService.getTasksByTag({
      query,
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
