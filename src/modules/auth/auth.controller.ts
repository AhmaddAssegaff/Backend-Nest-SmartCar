import { Controller, Post, Body, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Response() res: ExpressResponse) {
    try {
      const { access_token, user } = await this.authService.loginAndSetCookie(loginDto);
      return res.status(200).json({
        statusCode: 200,
        message: 'Login successful',
        data: {
          access_token,
          user: {
            username: user.name,
            role: user.role,
            id: user.id,
          },
        },
      });
    } catch (error) {
      return res.status(401).json({
        statusCode: 401,
        message: error.message || 'Login failed',
      });
    }
  }

  @Post('logout')
  async logout(@Response() res: ExpressResponse) {
    try {
      await this.authService.logoutAndClearCookie(res);
      return res.status(200).json({
        statusCode: 200,
        message: 'Logout successful',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error.message || 'Logout failed',
      });
    }
  }
}
