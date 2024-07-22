import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthUserDto, CreateUserDto } from 'apps/todo-hotels/src/auth/types';
import generateToken from 'apps/utils/jwt/generate';
import prismaClient from 'apps/prisma/db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('sendUser')
  async createUser(user: CreateUserDto) {
    const _user = await prismaClient.user.findUnique({
      where: {
        email: user.email,
        password: user.password,
      },
    });
    if (_user) return { ok: false };
    const { id } = await prismaClient.user.create({
      data: {
        email: user.email,
        password: user.password,
      },
      select: {
        id: true,
      },
    });

    return { ok: true, id };
  }

  @MessagePattern('getId')
  async getId(user: AuthUserDto) {
    const { id } = await prismaClient.user.findUnique({
      where: {
        email: user.email,
        password: user.password,
      },
    });
    if (!id) {
      return { ok: false };
    }
    const jwt = await generateToken({ id });
    return { ok: true, jwt };
  }
}
