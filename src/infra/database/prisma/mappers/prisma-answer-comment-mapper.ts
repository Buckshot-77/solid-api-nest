import { Comment as PrismaAnswerComment, Prisma } from '@prisma/client'

import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaAnswerCommentMapper {
  static toDomain(answerComment: PrismaAnswerComment): AnswerComment {
    if (!answerComment.answerId) throw new Error('Invalid comment type.')
    return AnswerComment.create(
      {
        answerId: new UniqueIdentifier(answerComment.answerId),
        authorId: new UniqueIdentifier(answerComment.authorId),
        content: answerComment.content,
        createdAt: answerComment.createdAt,
        updatedAt: answerComment.updatedAt,
      },
      new UniqueIdentifier(answerComment.id),
    )
  }

  static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId,
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
