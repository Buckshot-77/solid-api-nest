import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answer_id/comments')
export class CommentOnAnswerController {
  constructor(
    private readonly commentOnAnswerUseCase: CommentOnAnswerUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answer_id') answerId: string,
    @Body(bodyValidationPipe)
    body: CommentOnAnswerBodySchema,
  ): Promise<{ id: string }> {
    const { content } = body
    const { sub: authorId } = user

    const result = await this.commentOnAnswerUseCase.execute({
      content,
      authorId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { id: result.value.answerComment.id.toString() }
  }
}
