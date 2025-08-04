import { Injectable } from '@nestjs/common'
import { CreateProjectBodyType, GetProjecyQueryType, UpdateProjectBodyType } from './project.model'
import { ProjectRepo } from './project.repo'
@Injectable()
export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepo) {}

  async listProjects(props: { query: GetProjecyQueryType }) {
    return await this.projectRepo.listProjects(props.query)
  }

  async createProject(props: { data: CreateProjectBodyType }) {
    return await this.projectRepo.createProject(props.data)
  }

  async deleteProject({ id }: { id: string }) {
    try {
      await this.projectRepo.deleteProject({
        id,
      })
      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async updateProject(props: { data: UpdateProjectBodyType; id: string }) {
    return await this.projectRepo.updateProject(props.data, props.id)
  }

  async getProjectById({ id }: { id: string }) {
    return await this.projectRepo.getProjectById(id)
  }
}
