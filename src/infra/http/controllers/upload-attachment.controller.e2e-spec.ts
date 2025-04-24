import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from '@/test/factories/make-student'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Upload attachments (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './src/test/fixtures/sample.webp')

    expect(response.statusCode).toBe(201)
  })
})
