import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/utils/generic-service';
import { Client } from './entities/client.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClientsService extends GenericService<Client> {
  constructor(
    @InjectRepository(Client) private readonly clients: Repository<Client>,
    @InjectDataSource() private readonly data: DataSource,
  ) {
    super(clients, data);
  }
}
