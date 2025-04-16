import { Answer as PrismaAnswer, Prisma } from '@prisma/client'

import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaAnswerMapper {
  static toDomain(answer: PrismaAnswer): Answer {
    return Answer.create(
      {
        authorId: new UniqueIdentifier(answer.authorId),
        content: answer.content,
        questionId: new UniqueIdentifier(answer.questionId),
        attachments: undefined,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
      },
      new UniqueIdentifier(answer.id),
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
      questionId: answer.questionId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
