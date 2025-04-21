import { z } from 'zod'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AnswerCommentPresenter } from '../presenters/answer-comment-presenter'

const paginationValidationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  page_size: z.coerce.number().min(1).max(50).optional().default(20),
})

const paginationValidationPipe = new ZodValidationPipe(
  paginationValidationSchema,
)

type Pagination = z.infer<typeof paginationValidationSchema>

@Controller('/answers/:answer_id/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('answer_id') answerId: string,
    @Query(paginationValidationPipe) query: Pagination,
  ) {
    const { page, page_size: pageSize } = query

    const result = await this.fetchAnswerComments.execute({
      answerId,
      page,
      pageSize,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const presentedAnswerComments = result.value.answerComments.map(
      (answerComment) => AnswerCommentPresenter.toHTTP(answerComment),
    )

    return { answerComments: presentedAnswerComments }
  }
}
