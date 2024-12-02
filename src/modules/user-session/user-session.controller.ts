import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserSessionService } from './user-session.service';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';
import { JwtAuthGuard } from '../auth/strategies/auth.guard';
import { RolesGuard } from '@app/core/guards/rolesGuard.guard';
import { Roles } from '@app/core/decorators/role.decorator';
import { Role } from '@app/shared/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.user)
@Controller('user-session')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Post()
  create(@Body() createUserSessionDto: CreateUserSessionDto) {
    return this.userSessionService.create(createUserSessionDto);
  }

  @Get()
  findAll() {
    return this.userSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSessionDto: UpdateUserSessionDto) {
    return this.userSessionService.update(+id, updateUserSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSessionService.remove(+id);
  }
}
