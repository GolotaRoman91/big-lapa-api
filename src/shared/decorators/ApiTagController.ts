import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export const ApiTagController = tag =>
  applyDecorators(Controller(tag), ApiTags(tag))