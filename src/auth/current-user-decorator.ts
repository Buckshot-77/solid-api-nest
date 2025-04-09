import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenPayload } from './jwt.strategy'
import { Request } from 'express'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>()

    return request.user as TokenPayload
  },
)
