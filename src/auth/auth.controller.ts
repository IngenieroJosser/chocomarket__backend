import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/createUser.dto';
import { UserAuthenticated } from './dto/userAuthenticated.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Post('signin')
  signinUser(@Body() dto: UserAuthenticated) {
    return this.authService.authenticatedUser(dto);
  }
}
