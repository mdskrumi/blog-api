import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthResponseDto } from '../auth/dtos';
import { PrismaService } from '../prisma/prisma.service';
import { BlogReferenceDto } from './dto';

@Injectable()
export class BlogrefService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBlogrefDto: BlogReferenceDto, user: AuthResponseDto) {
    console.log({ user });
    const blog = await this.prismaService.blog.findUnique({
      where: {
        id: createBlogrefDto.blogId,
      },
    });
    if (!blog) {
      throw new NotFoundException('Blog is not found');
    }
    if (blog.authorId != user.id) {
      throw new ForbiddenException(
        'User is not authorized to modify this blog',
      );
    }
    try {
      const blogRef = await this.prismaService.blogReference.create({
        data: createBlogrefDto,
      });
      return blogRef;
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.prismaService.blogReference.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} blogref`;
  }

  update(id: number, updateBlogrefDto: BlogReferenceDto) {
    return `This action updates a #${id} blogref`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogref`;
  }
}
