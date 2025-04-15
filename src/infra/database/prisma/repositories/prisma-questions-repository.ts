import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.client.question.create({
      data,
    })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.client.question.update({ where: { id: data.id }, data })
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.client.question.delete({ where: { id } })
  }

  async findManyRecent({
    page,
    pageSize,
  }: PaginationParams): Promise<Question[]> {
    const foundQuestions = await this.prisma.client.question.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return foundQuestions.map((question) =>
      PrismaQuestionMapper.toDomain(question),
    )
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.client.question.findUnique({
      where: { id },
    })

    if (!question) {
      return null
    }

    const mappedQuestion = PrismaQuestionMapper.toDomain(question)

    return mappedQuestion
  }

  async findBySlug(slug_text: string): Promise<Question | null> {
    const question = await this.prisma.client.question.findUnique({
      where: { slug: slug_text },
    })

    if (!question) {
      return null
    }

    const mappedQuestion = PrismaQuestionMapper.toDomain(question)

    return mappedQuestion
  }
}
