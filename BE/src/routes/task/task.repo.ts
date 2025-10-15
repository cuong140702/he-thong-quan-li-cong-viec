import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import {
  CreateTaskBodyType,
  CreateTaskResType,
  GetCalendarQueryType,
  GetTasksQueryType,
  GetTasksResType,
  UpdateTaskBodyType,
  UpdateTaskResType,
} from './task.model'
import { Prisma } from '@prisma/client'

@Injectable()
export class TaskRepo {
  constructor(private prismaService: PrismaService) {}

  async list({
    limit,
    page,
    tags,
  }: {
    limit: number
    page: number
    brandIds?: number[]
    tags?: string[]
  }): Promise<GetTasksResType> {
    const skip = (page - 1) * limit
    const take = limit
    let where: Prisma.TaskWhereInput = {
      deletedAt: null,
    }

    if (tags && tags.length > 0) {
      where = {
        ...where,
        tags: {
          some: {
            id: {
              in: tags,
            },
          },
        },
      }
    }

    const [totalItems, data] = await Promise.all([
      this.prismaService.task.count({
        where,
      }),
      this.prismaService.task.findMany({
        skip,
        take,
        where,
        include: {
          tags: true,
        },
      }),
    ])
    return {
      data,
      totalItems,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalItems / limit),
    }
  }

  async createTask(data: CreateTaskBodyType, userId: string): Promise<CreateTaskResType> {
    const { tags, ...rest } = data

    const createdTask = await this.prismaService.task.create({
      data: {
        ...rest,
        userId,
        tags: tags ? { connect: tags.map((id) => ({ id })) } : undefined,
      },
      include: {
        tags: true,
      },
    })
    return {
      ...createdTask,
      tags: createdTask.tags.map((tag) => tag.id),
    }
  }

  async updateTask(data: UpdateTaskBodyType, id: string): Promise<UpdateTaskResType> {
    const { tags, ...rest } = data

    const updatedTask = await this.prismaService.task.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...rest,
        tags: tags ? { set: tags.map((id) => ({ id })) } : undefined,
      },
      include: {
        tags: true,
      },
    })
    return {
      ...updatedTask,
      tags: updatedTask.tags.map((tag) => tag.id),
    }
  }

  async getTasksByTag(query: { page: number; limit: number; tagId?: string }) {
    const { page, limit, tagId } = query

    const where = tagId
      ? {
          tags: {
            some: {
              id: tagId,
            },
          },
        }
      : {}

    const tasks = await this.prismaService.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        tags: true,
        user: true,
      },
    })

    return { data: tasks, page, limit }
  }

  deleteTask(
    {
      id,
    }: {
      id: string
    },
    isHard?: boolean,
  ) {
    return isHard
      ? this.prismaService.task.delete({
          where: {
            id,
          },
        })
      : this.prismaService.task.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        })
  }

  async getTaskById(id: string) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
      include: { tags: true },
    })
    if (!task) return null
    return task
  }

  async getTasksInRange({ query, userId }: { query: GetCalendarQueryType; userId: string | undefined }) {
    const s = query.startDate ? new Date(query.startDate) : undefined
    const e = query.deadline ? new Date(query.deadline) : undefined

    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
      // Task có thời gian tồn tại trong khoảng [s, e]
      AND: [
        { startDate: { lte: e } }, // task bắt đầu trước hoặc trong khoảng
        { deadline: { gte: s } }, // task kết thúc sau hoặc trong khoảng
      ],
    }

    if (userId) where.userId = userId

    if (query.projectId) {
      where.projectId = query.projectId
    }
    if (userId) {
      where.userId = userId
    }

    return this.prismaService.task.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        deadline: true,
        status: true,
        projectId: true,
        userId: true,
      },
    })
  }
}
