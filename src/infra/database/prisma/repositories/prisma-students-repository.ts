import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prismaService: PrismaService) {}
  async create(student: Student): Promise<void> {
    const prismaUser = PrismaStudentMapper.toPrisma(student)

    await this.prismaService.client.user.create({ data: prismaUser })
  }

  async save(student: Student): Promise<void> {
    const prismaUser = PrismaStudentMapper.toPrisma(student)

    await this.prismaService.client.user.update({
      where: { id: prismaUser.id },
      data: prismaUser,
    })
  }
  async deleteById(id: string): Promise<void> {
    await this.prismaService.client.user.delete({ where: { id } })
  }
  async findById(id: string): Promise<Student | null> {
    const foundStudent = await this.prismaService.client.user.findUnique({
      where: { id },
    })

    if (!foundStudent) return null

    const mappedStudent = PrismaStudentMapper.toDomain(foundStudent)

    return mappedStudent
  }
  async findByEmail(email: string): Promise<Student | null> {
    const foundStudent = await this.prismaService.client.user.findUnique({
      where: { email },
    })

    if (!foundStudent) return null

    const mappedStudent = PrismaStudentMapper.toDomain(foundStudent)

    return mappedStudent
  }
}
