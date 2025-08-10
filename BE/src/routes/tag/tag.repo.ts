import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateTagBodyType, GetTagQueryType, UpdateTagBodyType } from './tag.model'

@Injectable()
export class TagRepo {
  constructor(private readonly prisma: PrismaService) {}

  async listTags(query: GetTagQueryType) {
    const { page = 1, limit = 10 } = query
    const skip = (page - 1) * limit

    const where = {
      deletedAt: null,
    }

    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.tag.count({ where }),
    ])

    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    }
  }

  async createTag(data: CreateTagBodyType) {
    return await this.prisma.tag.create({
      data: {
        name: data.name,
      },
    })
  }

  async updateTag(data: UpdateTagBodyType, id: string) {
    return await this.prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
      },
    })
  }

  async deleteTag({ id }: { id: string }) {
    return await this.prisma.tag.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async getTagById(id: string) {
    return await this.prisma.tag.findUnique({
      where: { id },
    })
  }
}
