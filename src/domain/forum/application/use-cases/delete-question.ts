import { Either, left, right } from '@/core/types/either'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const foundQuestion = await this.questionsRepository.findById(questionId)

    if (!foundQuestion)
      return left(
        new ResourceNotFoundError('No question was found with the given ID'),
      )

    if (foundQuestion.authorId.toString() !== authorId)
      return left(
        new NotAllowedError('User not allowed to delete this question'),
      )

    await this.questionsRepository.deleteById(questionId)

    return right(null)
  }
}
