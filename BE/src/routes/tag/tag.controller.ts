import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import {
  CreateTagBodyDTO,
  CreateTagResDTO,
  GetTagByIdResDTO,
  GetTagParamsDTO,
  GetTagQueryDTO,
  GetTagsResDTO,
  UpdateTagBodyDTO,
  UpdateTagResDTO,
} from './tag.dto'
import { TagService } from './tag.service'

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ZodSerializerDto(GetTagsResDTO)
  listTags(@Query() query: GetTagQueryDTO) {
    return this.tagService.listTags({
      query,
    })
  }

  @Get(':tagId')
  @ZodSerializerDto(GetTagByIdResDTO)
  getTagById(@Param() params: GetTagParamsDTO) {
    return this.tagService.getTagById({
      id: params.tagId,
    })
  }

  @Post()
  @ZodSerializerDto(CreateTagResDTO)
  createTag(@Body() body: CreateTagBodyDTO) {
    return this.tagService.createTag({ data: body })
  }

  @Put(':tagId')
  @ZodSerializerDto(UpdateTagResDTO)
  updateTag(@Body() body: UpdateTagBodyDTO, @Param() params: GetTagParamsDTO) {
    return this.tagService.updateTag({
      data: body,
      id: String(params.tagId),
    })
  }

  @Delete(':tagId')
  @ZodSerializerDto(MessageResDTO)
  deleteTag(@Param() params: GetTagParamsDTO) {
    return this.tagService.deleteTag({
      id: params.tagId,
    })
  }
}
