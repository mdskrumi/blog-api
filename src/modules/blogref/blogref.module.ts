import { Module } from '@nestjs/common';
import { BlogrefService } from './blogref.service';
import { BlogrefController } from './blogref.controller';

@Module({
  controllers: [BlogrefController],
  providers: [BlogrefService],
})
export class BlogrefModule {}
