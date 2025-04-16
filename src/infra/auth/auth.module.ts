import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { JWTStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../config/env.service'
import { EnvModule } from '../config/env.module'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [
    JWTStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    EnvService,
  ],
})
export class AuthModule {}
