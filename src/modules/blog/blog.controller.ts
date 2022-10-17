import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBlogDto: CreateBlogDto, @CurrentUser() user: any) {
    return this.blogService.create(createBlogDto, user);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard)
  adminFindAll(@CurrentUser() user: any) {
    return this.blogService.adminFindAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() user: any,
  ) {
    return this.blogService.update(+id, updateBlogDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogService.remove(+id, user);
  }

  @Patch(':id/admin')
  @UseGuards(JwtAuthGuard)
  togglePublish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogService.togglePublishBlog(+id, user);
  }

  @Delete(':id/admin')
  @UseGuards(JwtAuthGuard)
  adminRemove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogService.remove(+id, user);
  }
}
