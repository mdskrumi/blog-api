import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { BlogModule } from './modules/blog/blog.module';
import { BlogrefModule } from './modules/blogref/blogref.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    BlogModule,
    BlogrefModule,
  ],
})
export class AppModule {}
