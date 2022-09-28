import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { PrismaService } from 'src/modules/prisma/prisma.service';

import { AuthDto, AuthResponseDto, ChangePasswordDto } from './dtos';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    try {
      const hash = await this.hashPassword(dto.password);
      const user = { email: dto.email, password: hash };
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

  async signin(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('No user found by the email');
    }
    const [userSalt, userHash] = user.password.split('.');
    const hash = (await scrypt(dto.password, userSalt, 32)) as Buffer;
    if (userHash !== hash.toString('hex')) {
      throw new BadRequestException('Password is incorrect');
    }

    const accessToken = await this.signedToken(user.id, user.email);

    return { ...user, access_token: accessToken.access_token };
  }

  async changePassword(dto: ChangePasswordDto, user: any) {
    if (dto.password != dto.confirmPassword) {
      throw new BadRequestException('passwords do not match');
    }

    const [userSalt, userHash] = user.password.split('.');
    const hash = (await scrypt(dto.password, userSalt, 32)) as Buffer;

    if (userHash === hash.toString('hex')) {
      throw new BadRequestException('Please enter a new password');
    }
    const newPassword = await this.hashPassword(dto.password);

    return this.prismaService.user.update({
      where: { email: user.email },
      data: { password: newPassword },
    });
  }

  async deleteUser(user: AuthResponseDto) {
    await this.prismaService.user.delete({
      where: {
        id: user.id,
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }

  async signedToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };

    const secret = this.configService.get('ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRATION');

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });

    return {
      access_token: token,
    };
  }
}
