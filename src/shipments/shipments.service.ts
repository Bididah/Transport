import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericService } from 'src/utils/generic-service';
import { Shipment } from './entities/shipment.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ShipmentsService extends GenericService<Shipment> {
  constructor(
    @InjectRepository(Shipment) private readonly repo: Repository<Shipment>,
    @InjectDataSource() private readonly data: DataSource,
    @InjectRepository(Client) private readonly clientRepo: Repository<Client>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super(repo, data);
  }

  async create(createDto: CreateShipmentDto): Promise<Shipment> {
    const { clientId, creatorId, ...data } = createDto;

    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    const user = await this.userRepo.findOne({ where: { id: creatorId } });

    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with id ${creatorId} not found`);
    }

    return super.create({
      ...data,
      createdBy: creatorId,
      client,
    });
  }
}
