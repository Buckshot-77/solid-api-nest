import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { Student } from '../../enterprise/entities/student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

describe('RegisterStudent unit tests', () => {
  let registerStudentUseCase: RegisterStudentUseCase
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let hashGenerator: FakeHasher

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    hashGenerator = new FakeHasher()
    registerStudentUseCase = new RegisterStudentUseCase(
      inMemoryStudentsRepository,
      hashGenerator,
    )
  })

  it('should be able to create a student', async () => {
    const payload = {
      email: 'any-email',
      name: 'any-name',
      password: 'any-password',
    }

    const result = await registerStudentUseCase.execute(payload)

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      student: expect.objectContaining({
        email: 'any-email',
        name: 'any-name',
        passwordHash: 'any-password-hashed',
      }),
    })
  })

  it('should return left if there is already a student with the same email', async () => {
    const student = Student.create({
      email: 'mail@mail.com',
      name: 'John Doe',
      passwordHash: '123456-hashed',
    })
    await inMemoryStudentsRepository.create(student)

    const result = await registerStudentUseCase.execute({
      email: 'mail@mail.com',
      name: 'another-name',
      password: 'another-password-hashed',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new StudentAlreadyExistsError('mail@mail.com'))
  })
})
