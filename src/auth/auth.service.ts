import { Injectable } from '@nestjs/common';
import { AuthDto } from './dtos';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  async signup(body: AuthDto) {
    return {
      ...body,
      hash: await this.hashPassword(body.password),
    };
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
