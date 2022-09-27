import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto } from './dtos';

@Controller('auth')
@Serialize(AuthResponseDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: AuthDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: AuthDto) {
    return this.authService.signin(body);
  }

  @Get('current-user')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() currentUser) {
    return currentUser;
  }
}
