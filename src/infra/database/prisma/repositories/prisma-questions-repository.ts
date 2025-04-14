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
    throw new Error('Method not implemented.')
  }

  async save(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyRecent({
    page,
    pageSize,
  }: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
  }
}
