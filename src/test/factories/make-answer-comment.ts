import { randTextRange } from '@ngneat/falso'

import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'

export function makeAnswerComment(override?: Partial<AnswerCommentProps>) {
  const answercomment = AnswerComment.create({
    authorId: new UniqueIdentifier(),
    content: randTextRange({ min: 300, max: 400 }),
    answerId: new UniqueIdentifier(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return answercomment
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)

    await this.prisma.client.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    })

    return answerComment
  }
}
