import { Attachment as PrismaAnswerAttachment, Prisma } from '@prisma/client'

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaAnswerAttachmentMapper {
  static toDomain(answerAttachment: PrismaAnswerAttachment): AnswerAttachment {
    if (!answerAttachment.answerId) throw new Error('Invalid attachment type.')
    return AnswerAttachment.create(
      {
        answerId: new UniqueIdentifier(answerAttachment.answerId),
        authorId: new UniqueIdentifier(answerAttachment.authorId),
        content: answerAttachment.content,
        createdAt: answerAttachment.createdAt,
        updatedAt: answerAttachment.updatedAt,
      },
      new UniqueIdentifier(answerAttachment.id),
    )
  }

  static toPrisma(
    answerAttachment: AnswerAttachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: answerAttachment.id.toString(),
      authorId: answerAttachment.authorId.toString(),
      content: answerAttachment.content,
      createdAt: answerAttachment.createdAt,
      updatedAt: answerAttachment.updatedAt,
    }
  }
}
