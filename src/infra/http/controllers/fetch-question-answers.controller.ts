import { z } from 'zod'

import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '../presenters/answer-presenter'

const paginationValidationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  page_size: z.coerce.number().min(1).max(50).optional().default(20),
})

const paginationValidationPipe = new ZodValidationPipe(
  paginationValidationSchema,
)

type Pagination = z.infer<typeof paginationValidationSchema>

@Controller('/questions/:question_id/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(paginationValidationPipe) query: Pagination,
    @Param('question_id') questionId: string,
  ) {
    const { page, page_size: pageSize } = query
    const result = await this.fetchQuestionAnswers.execute({
      page,
      pageSize,
      questionId,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const presentedQuestionAnswers = result.value.answers.map((question) =>
      AnswerPresenter.toHTTP(question),
    )

    return { answers: presentedQuestionAnswers }
  }
}
