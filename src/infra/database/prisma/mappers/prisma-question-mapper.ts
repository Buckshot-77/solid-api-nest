import { Question as PrismaQuestion, Prisma } from '@prisma/client'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(question: PrismaQuestion): Question {
    return Question.create(
      {
        title: question.title,
        content: question.content,
        authorId: new UniqueIdentifier(question.authorId),
        bestAnswerId: undefined,
        slug: Slug.createWithoutTreatments(question.slug),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
      new UniqueIdentifier(question.id),
    )
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
