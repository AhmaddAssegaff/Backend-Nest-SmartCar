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

  async loginAndSetCookie(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.name, loginDto.password);
    const payload = { username: user.name, role: user.role, id: user.id };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token, user };
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

  async logoutAndClearCookie(res: ExpressResponse) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
}
