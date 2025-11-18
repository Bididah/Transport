import { Controller } from '@nestjs/common';
import { GenericController } from 'src/utils/generic.controller';
import { Client } from './entities/client.entity';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController extends GenericController<Client> {
  constructor(private readonly clientsService: ClientsService) {
    super(clientsService);
  }
}
