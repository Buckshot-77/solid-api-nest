import { randEmail, randFullName, randWord } from '@ngneat/falso'

import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'

export function makeStudent(override?: Partial<StudentProps>) {
  const student = Student.create({
    email: randEmail(),
    name: randFullName(),
    passwordHash: randWord().concat('-hashed'),
    ...override,
  })

  return student
}
