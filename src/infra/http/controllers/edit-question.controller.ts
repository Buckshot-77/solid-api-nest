import { z } from 'zod'

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { QuestionPresenter } from '../presenters/question-presenter'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) { content, title }: EditQuestionBodySchema,
  ) {
    const userId = user.sub
    const result = await this.editQuestion.execute({
      questionId: id,
      newContent: content,
      title,
      attachmentIds: [],
      authorId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const presentedQuestion = QuestionPresenter.toHTTP(result.value.question)

    return { question: presentedQuestion }
  }
}
