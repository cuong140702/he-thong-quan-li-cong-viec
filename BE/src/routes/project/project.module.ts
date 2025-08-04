import { Module } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectRepo } from './project.repo'
import { ProjectController } from './project.controller'

@Module({
  providers: [ProjectService, ProjectRepo],
  controllers: [ProjectController],
})
export class ProjectModule {}
