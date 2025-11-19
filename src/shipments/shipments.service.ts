import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericService } from 'src/utils/generic-service';
import { Shipment } from './entities/shipment.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { generateTrackingNumber } from 'src/utils/random-number';

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
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });

    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    if (!creator) {
      throw new NotFoundException(`User with id ${creatorId} not found`);
    }

    const shipment = await super.create({ ...data, trakingNumber: '', createdBy: creatorId, client });
    shipment.trakingNumber = generateTrackingNumber(shipment.id);

    try {
      return await this.repo.save(shipment);
    } catch (e) {
      shipment.trakingNumber = generateTrackingNumber(shipment.id + Date.now());
      return this.repo.save(shipment);
    }
  }
}
