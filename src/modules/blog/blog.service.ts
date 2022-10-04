import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogService {
  constructor(private prismaService: PrismaService) {}
  create(createBlogDto: CreateBlogDto, user: any) {
    return this.prismaService.blog.create({
      data: { ...createBlogDto, userId: user.id },
    });
  }

  findAll() {
    return this.prismaService.blog.findMany();
  }

  async findOne(id: number) {
    const blog = await this.prismaService.blog.update({
      where: {
        id: id,
      },
      data: {
        readCount: { increment: 1 },
      },
    });
    if (!blog) throw new NotFoundException('Blog is unavailable.');
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto, user: any) {
    try {
      const { count } = await this.prismaService.blog.updateMany({
        where: {
          id: id,
          userId: user.id,
        },
        data: updateBlogDto,
      });
      if (!count) {
        throw new Error();
      }
      return {
        message: 'blog is updated',
      };
    } catch (err) {
      throw new NotFoundException('Blog is unavailable.');
    }
  }

  async remove(id: number, user: any) {
    try {
      const { count } = await this.prismaService.blog.deleteMany({
        where: { id: id, userId: user.id },
      });
      if (!count) {
        throw new Error();
      }
      return {
        message: 'blog is deleted',
      };
    } catch (err) {
      throw new NotFoundException('Blog is unavailable.');
    }
  }
}
