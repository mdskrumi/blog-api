import { Module } from '@nestjs/common';
import { UserModule } from './auth/auth.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
