import { z } from 'zod'

import { verify } from 'argon2'

import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prismaService.client.user.findUnique({
      where: { email },
    })

    if (!user) throw new UnauthorizedException('User credentials do not match')

    const passwordMatch = await verify(user.passwordHash, password)

    if (!passwordMatch)
      throw new UnauthorizedException('User credentials do not match')

    const accessToken = this.jwtService.sign({ sub: user.id })

    return {
      access_token: accessToken,
    }
  }
}
