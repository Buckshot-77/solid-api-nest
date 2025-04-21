import request from 'supertest'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/test/factories/make-answer'
import { StudentFactory } from '@/test/factories/make-student'
import { QuestionFactory } from '@/test/factories/make-question'

describe('Comment on Answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let jwt: JwtService
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /answers/:answer_id/comments', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      content: 'old content',
      title: 'old title',
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      content: 'old content',
      questionId: question.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Comment content',
      })

    expect(response.statusCode).toBe(201)

    const answerOnDatabase = await prisma.client.comment.findFirst({
      where: {
        answerId: answer.id.toString(),
        content: 'Comment content',
      },
    })

    expect(answerOnDatabase).toBeTruthy()
  })
})
