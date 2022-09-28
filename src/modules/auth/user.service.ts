import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async updateUser(dto: UpdateUserDto, userId: number) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
  }
}
