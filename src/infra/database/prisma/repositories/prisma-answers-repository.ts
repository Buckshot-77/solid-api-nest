import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.client.answer.create({
      data,
    })
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.client.answer.update({ where: { id: data.id }, data })
  }

  async findManyByQuestionId(
    questionId: string,
    { page, pageSize }: PaginationParams,
  ): Promise<Answer[]> {
    const foundAnswers = await this.prisma.client.answer.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        questionId,
      },
    })

    return foundAnswers.map((question) => PrismaAnswerMapper.toDomain(question))
  }

  async findById(id: string): Promise<Answer | null> {
    const foundAnswer = await this.prisma.client.answer.findUnique({
      where: { id },
    })

    if (!foundAnswer) return null

    return PrismaAnswerMapper.toDomain(foundAnswer)
  }

  async findByQuestionId(questionId: string): Promise<Answer[]> {
    const foundAnswers = await this.prisma.client.answer.findMany({
      where: { questionId },
    })

    return foundAnswers.map((question) => PrismaAnswerMapper.toDomain(question))
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.client.answer.delete({
      where: { id },
    })
  }
}
