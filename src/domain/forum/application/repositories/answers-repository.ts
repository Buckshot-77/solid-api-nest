import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract findManyByQuestionId(
    questionId: string,
    paginationParams: PaginationParams,
  ): Promise<Answer[]>
  abstract findById(id: string): Promise<Answer | null>
  abstract deleteById(id: string): Promise<void>
}
