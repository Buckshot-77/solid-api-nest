import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

import { ChooseBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-best-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/answers/:answer_id/choose-as-best')
export class ChooseBestAnswerController {
  constructor(private chooseBestAnswer: ChooseBestAnswerUseCase) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @Param('answer_id') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    const result = await this.chooseBestAnswer.execute({
      answerId,
      questionAuthorId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    return {
      bestAnswerId: result.value.bestAnswerId,
      questionId: result.value.questionId,
    }
  }
}
