import { Injectable } from '@nestjs/common'
import { TaskRepo } from './task.repo'
import { CreateTaskBodyType, GetCalendarQueryType, GetTasksQueryType, UpdateTaskBodyType } from './task.model'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'
@Injectable()
export class TaskService {
  constructor(private readonly taskRepo: TaskRepo) {}

  async listTasks(props: { query: GetTasksQueryType }) {
    return await this.taskRepo.list(props.query)
  }

  async createTask(props: { data: CreateTaskBodyType; userId: string }) {
    return await this.taskRepo.createTask(props.data, props.userId)
  }

  async deleteTask({ id }: { id: string }) {
    try {
      await this.taskRepo.deleteTask({
        id,
      })
      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async updateTask(props: { data: UpdateTaskBodyType; id: string }) {
    return await this.taskRepo.updateTask(props.data, props.id)
  }

  async getTasksByTag(props: { query: GetTasksQueryType }) {
    return await this.taskRepo.getTasksByTag(props.query)
  }

  async getTaskById({ id }: { id: string }) {
    return await this.taskRepo.getTaskById(id)
  }

  async getTasksInRange({ query, userId }: { query: GetCalendarQueryType; userId: string | undefined }) {
    return await this.taskRepo.getTasksInRange({ query, userId })
  }
}
