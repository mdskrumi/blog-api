import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { AuthDto } from './dtos';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { PrismaService } from 'src/prisma/prisma.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async signup(body: AuthDto) {
    try {
      const hash = await this.hashPassword(body.password);
      const user = { email: body.email, password: hash };
      return await this.prismaService.user.create({ data: user });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential taken');
        }
      }
      throw error;
    }
  }

  signin() {
    return {
      task: 'sign in',
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }
}
