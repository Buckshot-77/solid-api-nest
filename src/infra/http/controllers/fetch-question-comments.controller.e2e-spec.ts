import request from 'supertest'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { QuestionFactory } from '@/test/factories/make-question'
import { StudentFactory } from '@/test/factories/make-student'
import { QuestionCommentFactory } from '@/test/factories/make-question-comment'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

describe('Fetch question comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        QuestionFactory,
        QuestionCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:id/comments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      content: 'old content',
      title: 'old title',
    })

    const questionCommentsPromises: Promise<QuestionComment>[] = []

    for (let i = 0; i < 30; i++) {
      const createdComment = questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
      })

      questionCommentsPromises.push(createdComment)
    }

    await Promise.all(questionCommentsPromises)

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: '1', page_size: '10' })
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questionComments: expect.arrayContaining([
        expect.objectContaining({ questionId: question.id.toString() }),
      ]),
    })

    expect(response.body.questionComments.length).toEqual(10)
  })
})
