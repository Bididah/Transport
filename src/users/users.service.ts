import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/utils/generic-service';
import { User } from './entities/user.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends GenericService<User> {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectDataSource() private readonly data: DataSource,
  ) {
    super(users, data);
  }

  async create(createDto: DeepPartial<User>): Promise<User> {
    const saltOrRounds = 10;
    const hashed = await bcrypt.hash(createDto.password, saltOrRounds);
    Object.assign(createDto, { password: hashed });
    return await super.create(createDto);
  }
}
