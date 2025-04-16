import { User as PrismaUser, Prisma } from '@prisma/client'

import { Student } from '@/domain/forum/enterprise/entities/student'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

export class PrismaStudentMapper {
  static toDomain(user: PrismaUser): Student {
    return Student.create(
      {
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
      },
      new UniqueIdentifier(user.id),
    )
  }

  static toPrisma(user: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: 'STUDENT',
    }
  }
}
