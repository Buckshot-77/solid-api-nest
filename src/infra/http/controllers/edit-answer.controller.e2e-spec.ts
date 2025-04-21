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

describe('Edit answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /answers/:id', async () => {
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
      .put(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New Answer content',
      })

    expect(response.statusCode).toBe(200)

    const answerOnDatabase = await prisma.client.answer.findFirst({
      where: {
        authorId: user.id.toString(),
        id: answer.id.toString(),
      },
    })

    expect(answerOnDatabase).toEqual(
      expect.objectContaining({
        id: answer.id.toString(),
        content: 'New Answer content',
      }),
    )
  })
})
