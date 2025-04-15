import { z } from 'zod'

import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const paginationValidationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  page_size: z.coerce.number().min(1).max(50).optional().default(20),
})

const paginationValidationPipe = new ZodValidationPipe(
  paginationValidationSchema,
)

type Pagination = z.infer<typeof paginationValidationSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query(paginationValidationPipe) query: Pagination) {
    const { page, page_size: pageSize } = query
    const result = await this.fetchRecentQuestions.execute({
      page,
      pageSize,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const presentedQuestions = result.value.questions.map((question) =>
      QuestionPresenter.toHTTP(question),
    )

    return { questions: presentedQuestions }
  }
}
