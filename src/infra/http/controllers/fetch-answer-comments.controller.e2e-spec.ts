import request from 'supertest'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AnswerFactory } from '@/test/factories/make-answer'
import { StudentFactory } from '@/test/factories/make-student'
import { QuestionFactory } from '@/test/factories/make-question'
import { AnswerCommentFactory } from '@/test/factories/make-answer-comment'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        QuestionFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /answers/:id/comments', async () => {
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

    const answerCommentsPromises: Promise<AnswerComment>[] = []

    for (let i = 0; i < 30; i++) {
      const createdComment = answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        authorId: user.id,
      })

      answerCommentsPromises.push(createdComment)
    }

    await Promise.all(answerCommentsPromises)

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: '1', page_size: '10' })
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      answerComments: expect.arrayContaining([
        expect.objectContaining({ answerId: answer.id.toString() }),
      ]),
    })

    expect(response.body.answerComments.length).toEqual(10)
  })
})
