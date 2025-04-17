import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = []

  public async findById(id: string): Promise<QuestionComment | null> {
    const foundQuestionComment = this.questionComments.find(
      (questionComment) => questionComment.id.toString() === id,
    )

    if (!foundQuestionComment) return null

    return foundQuestionComment
  }

  public async findManyByQuestionId(
    questionId: string,
    { page, pageSize }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const foundQuestions = this.questionComments
      .filter((questionComment) => questionComment.questionId === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * pageSize, page * pageSize)

    return foundQuestions
  }

  public async create(questionComment: QuestionComment): Promise<void> {
    this.questionComments.push(questionComment)
  }

  public async deleteById(id: string): Promise<void> {
    const foundIndex = this.questionComments.findIndex(
      (questionComment) => questionComment.id.toString() === id,
    )

    if (foundIndex === -1) {
      return
    }

    this.questionComments.splice(foundIndex, 1)
  }
}
