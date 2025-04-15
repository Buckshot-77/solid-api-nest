import { Student } from '@/domain/forum/enterprise/entities/student'

export abstract class StudentsRepository {
  abstract create(student: Student): Promise<void>
  abstract save(student: Student): Promise<void>
  abstract deleteById(id: string): Promise<void>
  abstract findById(id: string): Promise<Student | null>
  abstract findByEmail(email: string): Promise<Student | null>
}
