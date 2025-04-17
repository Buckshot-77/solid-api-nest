import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const foundAttachments =
      await this.prismaService.client.attachment.findMany({
        where: { answerId },
      })

    return foundAttachments.map((attachment) =>
      PrismaAnswerAttachmentMapper.toDomain(attachment),
    )
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prismaService.client.attachment.deleteMany({
      where: { answerId },
    })
  }
}
