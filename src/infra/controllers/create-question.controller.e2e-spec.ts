/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'argon2'

import request from 'supertest'

describe('Create Question (e2e)', () => {
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

  test('[POST] /questions', async () => {
    const user = await prisma.client.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        passwordHash: await hash('12345678910'),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Question title',
        content: 'this is the content rs',
      })

    const questionOnDatabase = await prisma.client.question.findFirst({
      where: { title: 'Question title' },
    })

    expect(response.statusCode).toBe(201)
    expect(questionOnDatabase).toEqual(
      expect.objectContaining({
        title: 'Question title',
        content: 'this is the content rs',
      }),
    )
  })
})
