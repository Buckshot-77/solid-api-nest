import { randTextRange } from '@ngneat/falso'

import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper'

export function makeQuestionComment(override?: Partial<QuestionCommentProps>) {
  const questioncomment = QuestionComment.create({
    authorId: new UniqueIdentifier(),
    content: randTextRange({ min: 300, max: 400 }),
    questionId: new UniqueIdentifier(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return questioncomment
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {},
  ): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data)

    await this.prisma.client.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    })

    return questionComment
  }
}
