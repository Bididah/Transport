import { Body, Controller, Post } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { GenericController } from 'src/utils/generic.controller';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';

@Controller('shipments')
export class ShipmentsController extends GenericController<Shipment> {
  constructor(private readonly shipmentsService: ShipmentsService) {
    super(shipmentsService);
  }

  @Post()
  create(@Body() createDto: CreateShipmentDto) {
    return this.shipmentsService.create(createDto);
  }
}
