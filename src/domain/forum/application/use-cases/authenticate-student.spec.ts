import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Student } from '../../enterprise/entities/student'
import { makeStudent } from '@/test/factories/make-student'

describe('AuthenticateStudent unit tests', () => {
  let authenticateStudentUseCase: AuthenticateStudentUseCase
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let hashComparer: FakeHasher
  let encrypter: FakeEncrypter

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    hashComparer = new FakeHasher()
    encrypter = new FakeEncrypter()
    authenticateStudentUseCase = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      hashComparer,
      encrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const payload = {
      email: 'any-email',
      name: 'any-name',
      password: 'any-password',
    }

    const student = Student.create(
      makeStudent({
        email: payload.email,
        name: payload.name,
        passwordHash: payload.password.concat('-hashed'),
      }),
    )

    await inMemoryStudentsRepository.create(student)

    const result = await authenticateStudentUseCase.execute(payload)

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should return left, with WrongCredentialsError if student is not found', async () => {
    const result = await authenticateStudentUseCase.execute({
      email: 'mail123@mail.com',
      password: 'any-password',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new WrongCredentialsError())
  })

  it("should return left, with WrongCredentialsError if student password doesn't match", async () => {
    const student = Student.create(makeStudent())
    await inMemoryStudentsRepository.create(student)

    const result = await authenticateStudentUseCase.execute({
      email: student.email,
      password: 'another-one-bites-the-dust',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new WrongCredentialsError())
  })
})
