import { Injectable } from '@nestjs/common'

import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.client.comment.findUnique({
      where: { id },
    })

    if (!questionComment) return null

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    id: string,
    { page, pageSize }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const foundQuestionComments = await this.prisma.client.comment.findMany({
      where: { questionId: id },
      take: pageSize,
      skip: (page - 1) * pageSize,
    })

    return foundQuestionComments.map((questionComment) =>
      PrismaQuestionCommentMapper.toDomain(questionComment),
    )
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)
    await this.prisma.client.comment.create({ data })
  }

  async save(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)
    await this.prisma.client.comment.update({ data, where: { id: data.id } })
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.client.comment.delete({ where: { id } })
  }
}
