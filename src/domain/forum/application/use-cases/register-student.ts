import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/types/either'

import { Student } from '@/domain/forum/enterprise/entities/student'

import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}
  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithTheSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithTheSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }
    const passwordHash = await this.hashGenerator.hash(password)
    const student = Student.create({ email, name, passwordHash })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
