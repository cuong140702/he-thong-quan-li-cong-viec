import { Module } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagRepo } from './tag.repo'
import { TagController } from './tag.controller'
@Module({
  providers: [TagService, TagRepo],
  controllers: [TagController],
})
export class TagModule {}
