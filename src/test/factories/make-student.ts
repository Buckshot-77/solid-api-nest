import { randEmail, randFullName, randWord } from '@ngneat/falso'

import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'

export function makeStudent(override?: Partial<StudentProps>) {
  const student = Student.create({
    email: randEmail(),
    name: randFullName(),
    passwordHash: randWord().concat('-hashed'),
    ...override,
  })

  return student
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data)

    await this.prisma.client.user.create({
      data: { ...PrismaStudentMapper.toPrisma(student), role: 'STUDENT' },
    })

    return student
  }
}
