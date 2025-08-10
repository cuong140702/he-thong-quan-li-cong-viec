import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import {
  CreateProjectBodyDTO,
  CreateProjectResDTO,
  GetProjectByIdResDTO,
  GetProjectParamsDTO,
  GetProjectsResDTO,
  GetProjectQueryDTO,
  UpdateProjectBodyDTO,
  UpdateProjectResDTO,
} from './project.dto'
import { ProjectService } from './project.service'

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ZodSerializerDto(GetProjectsResDTO)
  list(@Query() query: GetProjectQueryDTO) {
    return this.projectService.listProjects({
      query,
    })
  }

  @Get(':projectId')
  @ZodSerializerDto(GetProjectByIdResDTO)
  getProjectById(@Param() params: GetProjectParamsDTO) {
    return this.projectService.getProjectById({
      id: params.projectId,
    })
  }

  @Post()
  @ZodSerializerDto(CreateProjectResDTO)
  create(@Body() body: CreateProjectBodyDTO) {
    return this.projectService.createProject({ data: body })
  }

  @Put(':projectId')
  @ZodSerializerDto(UpdateProjectResDTO)
  updateTask(@Body() body: UpdateProjectBodyDTO, @Param() params: GetProjectParamsDTO) {
    return this.projectService.updateProject({
      data: body,
      id: String(params.projectId),
    })
  }

  @Delete(':projectId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetProjectParamsDTO) {
    return this.projectService.deleteProject({
      id: params.projectId,
    })
  }
}
