import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'

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

    const result = await authenticateStudentUseCase.execute(payload)

    expect(result.isRight())
    expect(result.value).toEqual({
      student: expect.objectContaining({
        email: 'any-email',
        name: 'any-name',
        passwordHash: 'any-password-hashed',
      }),
    })
  })
})
