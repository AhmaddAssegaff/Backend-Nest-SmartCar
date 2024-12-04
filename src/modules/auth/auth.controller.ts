import { Controller, Post, Body, Response, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Response() res: ExpressResponse) {
    try {
      const { user } = await this.authService.loginAndSetCookie(loginDto, res);
      return res.status(200).json({
        statusCode: 200,
        message: 'Login successful',
        data: {
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
  async logout(@Req() req: Request, @Response() res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          statusCode: 400,
          message: 'User not authenticated',
        });
      }

      await this.authService.logoutAndClearCookie(userId, res);
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
