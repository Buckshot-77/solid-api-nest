import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'

@Injectable()
export class Argon2Hasher implements HashGenerator, HashComparer {
  async hash(plainText: string): Promise<string> {
    return hash(plainText)
  }
  async compare(plain: string, hash: string): Promise<boolean> {
    return verify(plain, hash)
  }
}
