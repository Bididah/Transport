import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenericController } from 'src/utils/generic.controller';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController extends GenericController<User> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto as any);
  }
}
