import { Injectable } from '@nestjs/common'

import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.client.comment.findUnique({
      where: { id },
    })

    if (!answerComment) return null

    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(
    id: string,
    { page, pageSize }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const foundAnswerComments = await this.prisma.client.comment.findMany({
      where: { answerId: id },
      take: pageSize,
      skip: (page - 1) * pageSize,
    })

    return foundAnswerComments.map((answerComment) =>
      PrismaAnswerCommentMapper.toDomain(answerComment),
    )
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)
    await this.prisma.client.comment.create({ data })
  }

  async save(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)
    await this.prisma.client.comment.update({ data, where: { id: data.id } })
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.client.comment.delete({ where: { id } })
  }
}
