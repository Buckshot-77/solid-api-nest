import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  private students: Student[] = []
  async create(student: Student): Promise<void> {
    this.students.push(student)

    return Promise.resolve()
  }

  public async save(student: Student): Promise<void> {
    const foundStudentIndex = this.students.findIndex(
      (iteratedStudent) => iteratedStudent.id === student.id,
    )

    this.students[foundStudentIndex] = student
  }

  async deleteById(id: string): Promise<void> {
    const foundIndex = this.students.findIndex(
      (notification) => notification.id === id,
    )

    if (foundIndex === -1) {
      return
    }

    this.students.splice(foundIndex, 1)
  }

  async findById(id: string): Promise<Student | null> {
    return this.students.find((student) => student.id.toString() === id) ?? null
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.students.find((student) => student.email === email) ?? null
  }
}
