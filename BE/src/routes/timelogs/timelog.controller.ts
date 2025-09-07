import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { TimeLogService } from './timelog.service'
import {
  ClockInBodyDTO,
  ClockOutBodyDTO,
  CreateManualLogDTO,
  CreateManualLogResDTO,
  GetClockInResDTO,
  GetClockOutResDTO,
  GetTimelogByIdResDTO,
  GetTimelogByTaskResDTO,
  GetTimelogParamsDTO,
  GetTotalByTaskResDTO,
} from './timelog.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('timelog')
export class TimelogController {
  constructor(private readonly timelogService: TimeLogService) {}
  @Post('clock-in')
  @ZodSerializerDto(GetClockInResDTO)
  clockIn(@Body() body: ClockInBodyDTO) {
    return this.timelogService.clockIn({ id: body.taskId })
  }

  @Put('clock-out/:timelogId')
  @ZodSerializerDto(GetClockOutResDTO)
  clockOut(@Param() params: GetTimelogParamsDTO) {
    return this.timelogService.clockOut({
      timelogId: String(params.timelogId),
    })
  }

  @Post()
  @ZodSerializerDto(CreateManualLogResDTO)
  createManual(@Body() body: CreateManualLogDTO) {
    return this.timelogService.createManual(body)
  }

  @Get('task/:taskId')
  @ZodSerializerDto(GetTimelogByTaskResDTO)
  getLogsByTask(@Param() params: ClockInBodyDTO) {
    return this.timelogService.getLogsByTask({ id: params.taskId })
  }

  @Get(':id')
  @ZodSerializerDto(GetTimelogByIdResDTO)
  getById(@Param() params: GetTimelogParamsDTO) {
    return this.timelogService.getById({ id: params.timelogId })
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateLogDto) {
  //   return this.timelogService.update(id, dto)
  // }

  @Delete(':timelogId')
  @ZodSerializerDto(MessageResDTO)
  deleteTimelog(@Param() params: GetTimelogParamsDTO) {
    return this.timelogService.deleteTimelog({ id: params.timelogId })
  }

  @Post('task/:taskId/total')
  @ZodSerializerDto(GetTotalByTaskResDTO)
  totalByTask(@Param('taskId') taskId: string, @Body() body: { startTime: Date }) {
    return this.timelogService.totalByTask(taskId, body.startTime)
  }
}
