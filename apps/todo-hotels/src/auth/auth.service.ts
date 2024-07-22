import { Injectable } from '@nestjs/common';
import prismaClient from 'apps/prisma/db';
import validateJWT from 'apps/utils/jwt/validate';

@Injectable()
export class AuthService {
  async getUser(token: string) {
    const { id } = await validateJWT(token);
    const user = await prismaClient.user.findUnique({ where: { id } });
    return user;
  }
}
