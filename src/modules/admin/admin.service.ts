import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateOneTimeTokenDto } from './dto/create-one-time-token.dto';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { OTTException } from '@app/core/exceptions';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createOneTimeToken(createOneTimeTokenDto: CreateOneTimeTokenDto) {
    const { userId } = createOneTimeTokenDto;

    const unusedToken = await this.prisma.oneTimeToken.findFirst({
      where: { isUsed: false },
    });

    if (unusedToken) {
      throw new OTTException('Cannot create new token: There are still unused tokens.');
    }

    const token = Math.random().toString(36).substr(2, 6);
    return await this.prisma.oneTimeToken.create({
      data: {
        userId,
        token,
        expiredAt: new Date(Date.now() + 3600000),
      },
    });
  }
}
