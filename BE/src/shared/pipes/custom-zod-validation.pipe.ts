import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { ZodSchema } from 'zod'

const NormalZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return error.errors.map((error) => {
      return {
        ...error,
        path: error.path.join('.'),
      }
    }) as any
  },
})

export class CustomZodValidationPipe extends NormalZodValidationPipe {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const result = super.transform(value, metadata)
      return result
    } catch (error) {
      if (metadata.type === 'query') {
        throw new BadRequestException(error)
      }
      throw new UnprocessableEntityException(error)
    }
  }
}

export default CustomZodValidationPipe
