import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'

import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaAttachmentMapper {
  static toDomain(attachment: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: attachment.title,
        url: attachment.url,
      },
      new UniqueIdentifier(attachment.id),
    )
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
