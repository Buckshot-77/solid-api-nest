import { Question } from '@/domain/forum/enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract deleteById(id: string): Promise<void>
  abstract findManyRecent({
    page,
    pageSize,
  }: PaginationParams): Promise<Question[]>
  abstract findById(id: string): Promise<Question | null>
  abstract findBySlug(slug_text: string): Promise<Question | null>
}
