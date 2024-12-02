import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateOneTimeTokenDto } from './dto/create-one-time-token.dto';
import { Roles } from '@app/core/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/strategies/auth.guard';
import { RolesGuard } from '@app/core/guards/rolesGuard.guard';
import { Role } from '@app/shared/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly Admin: AdminService) {}

  @Post('create-user')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.Admin.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.Admin.findOne(id);
  }

  @Post('one-time-token')
  async createOneTimeToken(@Body() createOneTimeTokenDto: CreateOneTimeTokenDto) {
    return this.Admin.createOneTimeToken(createOneTimeTokenDto);
  }
}
