import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtPayloadS } from '@core/interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { name } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async loginAndSetCookie(loginDto: LoginDto, res: ExpressResponse) {
    const user = await this.validateUser(loginDto.name, loginDto.password);
    const payload = { username: user.name, role: user.role, id: user.id };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      statusCode: 200,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(user: any) {
    const payload: JwtPayloadS = {
      username: user.name,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
    };
  }

  async logoutAndClearCookie(userId: string, res: ExpressResponse) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    res.clearCookie('access_token', {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'strict',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'strict',
    });

    return { statusCode: 200, message: 'Logout successful' };
  }
}
