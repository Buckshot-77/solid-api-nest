import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'

const commonBetweenImportsAndExports = [
  PrismaService,
  PrismaQuestionAttachmentsRepository,
  PrismaAnswerAttachmentsRepository,
  PrismaAnswerCommentsRepository,
  PrismaQuestionCommentsRepository,
  PrismaQuestionsRepository,
  PrismaAnswersRepository,
]

@Module({
  providers: [...commonBetweenImportsAndExports],
  exports: [...commonBetweenImportsAndExports],
})
export class DatabaseModule {}
