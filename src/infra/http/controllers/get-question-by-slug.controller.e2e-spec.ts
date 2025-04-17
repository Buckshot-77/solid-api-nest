import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get Question by Slug (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await prisma.client.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        passwordHash: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.client.question.create({
      data: {
        title: 'Question 02',
        slug: 'question-02',
        content: 'Question content',
        authorId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .get('/questions/question-02')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 02' }),
    })
  })
})
