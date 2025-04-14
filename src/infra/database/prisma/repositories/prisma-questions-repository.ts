import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '@/domain/forum/enterprise/entities/question'

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
  async findById(id: string): Promise<Question | undefined> {
    throw new Error('Method not implemented.')
  }
  async findBySlug(slug_text: string): Promise<Question | undefined> {
    throw new Error('Method not implemented.')
  }
}
