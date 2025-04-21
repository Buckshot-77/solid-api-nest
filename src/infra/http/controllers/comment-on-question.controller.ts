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
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:question_id/comments')
export class CommentOnQuestionController {
  constructor(
    private readonly commentOnQuestionUseCase: CommentOnQuestionUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('question_id') questionId: string,
    @Body(bodyValidationPipe)
    body: CommentOnQuestionBodySchema,
  ): Promise<{ id: string }> {
    const { content } = body
    const { sub: authorId } = user

    const result = await this.commentOnQuestionUseCase.execute({
      content,
      authorId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { id: result.value.questionComment.id.toString() }
  }
}
