import { z } from 'zod'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AnswerPresenter } from '../presenters/answer-presenter'

const editAnswerBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) { content }: EditAnswerBodySchema,
  ) {
    const userId = user.sub
    const result = await this.editAnswer.execute({
      answerId: id,
      newContent: content,
      attachmentIds: [],
      authorId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const presentedAnswer = AnswerPresenter.toHTTP(result.value.answer)

    return { answer: presentedAnswer }
  }
}
