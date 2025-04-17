import { Attachment as PrismaAttachment } from '@prisma/client'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) throw new Error('Invalid attachment')

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueIdentifier(raw.id),
        questionId: new UniqueIdentifier(raw.questionId),
      },
      new UniqueIdentifier(raw.id),
    )
  }
}
