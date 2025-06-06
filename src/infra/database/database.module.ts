import { Module } from '@nestjs/common'

import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

import { PrismaService } from './prisma/prisma.service'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'

const commonBetweenImportsAndExports = [
  PrismaService,
  {
    provide: QuestionsRepository,
    useClass: PrismaQuestionsRepository,
  },
  {
    provide: StudentsRepository,
    useClass: PrismaStudentsRepository,
  },
  {
    provide: QuestionAttachmentsRepository,
    useClass: PrismaQuestionAttachmentsRepository,
  },
  {
    provide: AnswerAttachmentsRepository,
    useClass: PrismaAnswerAttachmentsRepository,
  },
  {
    provide: AnswerCommentsRepository,
    useClass: PrismaAnswerCommentsRepository,
  },
  {
    provide: QuestionCommentsRepository,
    useClass: PrismaQuestionCommentsRepository,
  },
  { provide: AnswersRepository, useClass: PrismaAnswersRepository },
  { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
]

@Module({
  providers: [...commonBetweenImportsAndExports],
  exports: [...commonBetweenImportsAndExports],
})
export class DatabaseModule {}
