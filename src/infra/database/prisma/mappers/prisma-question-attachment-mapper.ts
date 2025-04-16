import { Attachment as PrismaQuestionAttachment, Prisma } from '@prisma/client'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaQuestionAttachmentMapper {
  static toDomain(
    questionAttachment: PrismaQuestionAttachment,
  ): QuestionAttachment {
    if (!questionAttachment.questionId)
      throw new Error('Invalid attachment type.')
    return QuestionAttachment.create(
      {
        attachmentId,
      },
      new UniqueIdentifier(questionAttachment.id),
    )
  }
}
