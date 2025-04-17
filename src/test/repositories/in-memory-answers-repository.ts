import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  constructor(
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  public async create(answer: Answer): Promise<void> {
    this.answers.push(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  public async findManyByQuestionId(
    questionId: string,
    { page, pageSize }: PaginationParams,
  ): Promise<Answer[]> {
    const foundAnswers = this.answers
      .filter((answer) => answer.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * pageSize, page * pageSize)

    return foundAnswers
  }

  public async findById(id: string): Promise<Answer | null> {
    return this.answers.find((answer) => answer.id.toString() === id) ?? null
  }

  public async save(answer: Answer): Promise<void> {
    const foundAnswerIndex = this.answers.findIndex(
      (iteratedAnswer) => iteratedAnswer.id === answer.id,
    )

    this.answers[foundAnswerIndex] = answer
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  public async deleteById(id: string): Promise<void> {
    const foundIndex = this.answers.findIndex(
      (answer) => answer.id.toString() === id,
    )

    if (foundIndex === -1) {
      return
    }

    await this.answerAttachmentsRepository.deleteManyByAnswerId(id)

    this.answers.splice(foundIndex, 1)
  }
}
