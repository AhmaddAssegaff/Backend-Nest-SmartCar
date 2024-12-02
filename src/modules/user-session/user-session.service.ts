import { Injectable } from '@nestjs/common';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';
import { PrismaService } from '@app/shared/prisma/prisma.service';

@Injectable()
export class UserSessionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserSessionDto: CreateUserSessionDto) {
    return 'This action adds a new userSession';
  }

  findAll() {
    return `This action returns all userSession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSession`;
  }

  update(id: number, updateUserSessionDto: UpdateUserSessionDto) {
    return `This action updates a #${id} userSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSession`;
  }
}
