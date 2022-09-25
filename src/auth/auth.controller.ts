import { Controller, Post } from '@nestjs/common';

@Controller('user')
export class AuthController {
  @Post('signup')
  signup() {
    return {
      task: 'sign up',
    };
  }

  @Post('signin')
  signin() {
    return {
      task: 'sign in',
    };
  }
}
