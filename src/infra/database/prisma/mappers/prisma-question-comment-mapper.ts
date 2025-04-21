import { Comment as PrismaQuestionComment, Prisma } from '@prisma/client'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaQuestionCommentMapper {
  static toDomain(questionComment: PrismaQuestionComment): QuestionComment {
    if (!questionComment.questionId) throw new Error('Invalid comment type.')
    return QuestionComment.create(
      {
        questionId: new UniqueIdentifier(questionComment.questionId),
        authorId: new UniqueIdentifier(questionComment.authorId),
        content: questionComment.content,
        createdAt: questionComment.createdAt,
        updatedAt: questionComment.updatedAt,
      },
      new UniqueIdentifier(questionComment.id),
    )
  }

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
