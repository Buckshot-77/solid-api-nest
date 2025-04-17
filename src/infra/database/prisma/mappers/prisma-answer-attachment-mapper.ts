import { Attachment as PrismaAttachment } from '@prisma/client'

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('Invalid attachment')

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueIdentifier(raw.id),
        answerId: new UniqueIdentifier(raw.answerId),
      },
      new UniqueIdentifier(raw.id),
    )
  }
}
