import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import { envSchema } from './config/env.config'
import { AuthModule } from './auth/auth.module'

import { HttpModule } from './http/http.module'
import { EnvModule } from './config/env.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
