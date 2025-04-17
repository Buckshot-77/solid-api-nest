import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionPresenter } from '../presenters/question-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug_text: slug })

    if (result.isLeft()) {
      const error = result.value

      throw new NotFoundException(error.message)
    }

    const presentedQuestion = QuestionPresenter.toHTTP(result.value.question)

    return { question: presentedQuestion }
  }
}
