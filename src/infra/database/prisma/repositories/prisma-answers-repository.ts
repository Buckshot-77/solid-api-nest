import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async findManyByQuestionId(
    questionId: string,
    paginationParams: PaginationParams,
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
  async findById(id: string): Promise<Answer | null> {
    throw new Error('Method not implemented.')
  }
  async findByQuestionId(questionId: string): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
  async deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
