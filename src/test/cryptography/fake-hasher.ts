import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plainText: string): Promise<string> {
    return Promise.resolve(plainText.concat('-hashed'))
  }
  async compare(hash: string, plain: string): Promise<boolean> {
    return Promise.resolve(plain.concat('-hashed') === hash)
  }
}
