import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password: passwordHash } = body

    const userWithTheSameEmail =
      await this.prismaService.client.user.findUnique({ where: { email } })

    if (userWithTheSameEmail)
      throw new ConflictException('There is a user with that email already')

    await this.prismaService.client.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    })
  }
}
