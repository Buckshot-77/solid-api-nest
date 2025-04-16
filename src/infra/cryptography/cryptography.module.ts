import { Module } from '@nestjs/common'

import { Argon2Hasher } from './argon2-hasher'
import { JwtEncrypter } from './jwt-encrypter'

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: Argon2Hasher,
    },
    { provide: HashGenerator, useClass: Argon2Hasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
