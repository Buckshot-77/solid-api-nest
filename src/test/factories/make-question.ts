import {
  randAirportCode,
  randAnimalType,
  randSentence,
  randTextRange,
  randVehicleFuel,
} from '@ngneat/falso'

import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeQuestion(override?: Partial<QuestionProps>) {
  const question = Question.create({
    authorId: new UniqueIdentifier(),
    content: randTextRange({ min: 300, max: 400 }),
    title: randSentence(),
    slug: Slug.createWithoutTreatments(
      `${randAnimalType().toLowerCase()}-${randVehicleFuel().toLowerCase()}-${randAirportCode().toLowerCase()}`,
    ),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data)

    await this.prisma.client.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
