import { z } from 'zod'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { AnswerPresenter } from '../presenters/answer-presenter'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:question_id/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param('question_id') questionId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) { content }: AnswerQuestionBodySchema,
  ) {
    const userId = user.sub
    const result = await this.answerQuestion.execute({
      authorId: userId,
      content,
      questionId,
    })

    if (result.isLeft()) {
      const error = result.value as unknown as Error

      throw new BadRequestException(error.message)
    }

    const presentedAnswer = AnswerPresenter.toHTTP(result.value.answer)

    return { answer: presentedAnswer }
  }
}
