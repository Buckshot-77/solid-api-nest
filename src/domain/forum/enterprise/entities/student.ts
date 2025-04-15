import { Entity } from '@/core/entities/entity'
import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'

interface StudentProps {
  name: string
  email: string
  passwordHash: string
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this._props.name
  }

  get email() {
    return this._props.email
  }

  get passwordHash() {
    return this._props.passwordHash
  }

  static create(props: StudentProps, id?: UniqueIdentifier): Student {
    const question = new Student(props, id)

    return question
  }
}
