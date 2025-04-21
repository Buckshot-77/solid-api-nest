import { randTextRange } from '@ngneat/falso'

import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'

export function makeAnswer(override?: Partial<AnswerProps>) {
  const answer = Answer.create({
    authorId: new UniqueIdentifier(),
    content: randTextRange({ min: 300, max: 400 }),
    questionId: new UniqueIdentifier(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return answer
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.client.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })

    return answer
  }
}
