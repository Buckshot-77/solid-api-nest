import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  findById(id: string): Promise<QuestionComment | undefined> {
    throw new Error('Method not implemented.')
  }
  findManyByQuestionId(
    id: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }
  create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
