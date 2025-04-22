import { z } from 'zod'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'

import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { QuestionCommentPresenter } from '../presenters/quesiton-comment-presenter'

const paginationValidationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  page_size: z.coerce.number().min(1).max(50).optional().default(20),
})

const paginationValidationPipe = new ZodValidationPipe(
  paginationValidationSchema,
)

type Pagination = z.infer<typeof paginationValidationSchema>

@Controller('/questions/:question_id/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('question_id') questionId: string,
    @Query(paginationValidationPipe) query: Pagination,
  ) {
    const { page, page_size: pageSize } = query

    const result = await this.fetchQuestionComments.execute({
      questionId,
      page,
      pageSize,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const presentedQuestionComments = result.value.questionComments.map(
      (questionComment) => QuestionCommentPresenter.toHTTP(questionComment),
    )

    return { questionComments: presentedQuestionComments }
  }
}
