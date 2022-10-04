import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthResponseDto } from '../auth/dtos';
import { PrismaService } from '../prisma/prisma.service';
import { BlogReferenceDto, UpdateBlogReferenceDto } from './dto';

@Injectable()
export class BlogrefService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBlogrefDto: BlogReferenceDto, user: AuthResponseDto) {
    const blog = await this.prismaService.blog.findUnique({
      where: {
        id: createBlogrefDto.blogId,
      },
    });
    if (!blog) {
      throw new NotFoundException('Blog is not found');
    }
    if (blog.userId != user.id) {
      throw new ForbiddenException(
        'User is not authorized to modify this blog',
      );
    }

    try {
      const blogRef = await this.prismaService.blogReference.create({
        data: { ...createBlogrefDto, userId: user.id },
      });
      return blogRef;
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.prismaService.blogReference.findMany();
  }

  async findOne(id: number) {
    const blogRef = await this.prismaService.blogReference.findUnique({
      where: { id: id },
    });
    if (!blogRef) {
      throw new NotFoundException('Blog is not found');
    }
    return blogRef;
  }

  async update(
    id: number,
    updateBlogrefDto: UpdateBlogReferenceDto,
    user: AuthResponseDto,
  ) {
    const { count } = await this.prismaService.blogReference.updateMany({
      where: {
        AND: [{ id: id }, { userId: user.id }],
      },
      data: updateBlogrefDto,
    });

    if (count === 0) {
      throw new ForbiddenException(
        'User is not authorized to update this blog reference',
      );
    }

    return {
      message: 'The blog is updated',
    };
  }

  async remove(id: number, user: AuthResponseDto) {
    const { count } = await this.prismaService.blogReference.deleteMany({
      where: {
        AND: [{ id: id }, { userId: user.id }],
      },
    });
    if (count === 0) {
      throw new ForbiddenException(
        'User is not authorized to delete this blog reference',
      );
    }

    return {
      message: 'The blog is deleted',
    };
  }
}
