import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateProjectBodyType, GetProjectQueryType, UpdateProjectBodyType } from './project.model'

@Injectable()
export class ProjectRepo {
  constructor(private readonly prisma: PrismaService) {}

  async listProjects(query: GetProjectQueryType) {
    const { page = 1, limit = 10 } = query
    const skip = (page - 1) * limit

    const where = {
      deletedAt: null,
    }

    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          tasks: {
            select: {
              title: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ])

    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    }
  }

  async createProject(data: CreateProjectBodyType) {
    return await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        userId: data.userId,
      },
    })
  }

  async updateProject(data: UpdateProjectBodyType, id: string) {
    return await this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    })
  }

  async deleteProject({ id }: { id: string }) {
    return await this.prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async getProjectById(id: string) {
    return await this.prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        tasks: {
          select: {
            title: true,
            status: true,
          },
        },
      },
    })
  }
}
