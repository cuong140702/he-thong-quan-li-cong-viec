import { Injectable } from '@nestjs/common'
import { CreateTagBodyType, GetTagQueryType, UpdateTagBodyType } from './tag.model'
import { TagRepo } from './tag.repo'
@Injectable()
export class TagService {
  constructor(private readonly projectRepo: TagRepo) {}

  async listTags(props: { query: GetTagQueryType }) {
    return await this.projectRepo.listTags(props.query)
  }

  async createTag(props: { data: CreateTagBodyType }) {
    return await this.projectRepo.createTag(props.data)
  }

  async deleteTag({ id }: { id: string }) {
    try {
      await this.projectRepo.deleteTag({
        id,
      })
      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async updateTag(props: { data: UpdateTagBodyType; id: string }) {
    return await this.projectRepo.updateTag(props.data, props.id)
  }

  async getTagById({ id }: { id: string }) {
    return await this.projectRepo.getTagById(id)
  }
}
