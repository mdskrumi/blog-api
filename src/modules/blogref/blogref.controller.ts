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
import { AuthResponseDto } from '../auth/dtos';
import { BlogrefService } from './blogref.service';

import { BlogReferenceDto, UpdateBlogReferenceDto } from './dto';

@Controller('blogref')
export class BlogrefController {
  constructor(private readonly blogrefService: BlogrefService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createBlogrefDto: BlogReferenceDto,
    @CurrentUser() user: AuthResponseDto,
  ) {
    return this.blogrefService.create(createBlogrefDto, user);
  }

  @Get()
  findAll() {
    return this.blogrefService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogrefService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBlogrefDto: UpdateBlogReferenceDto,
    @CurrentUser() user: AuthResponseDto,
  ) {
    return this.blogrefService.update(+id, updateBlogrefDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: AuthResponseDto) {
    return this.blogrefService.remove(+id, user);
  }
}
