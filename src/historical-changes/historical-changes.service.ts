import { Injectable } from '@nestjs/common';
import { CreateHistoricalChangeDto } from './dto/create-historical-change.dto';
import { UpdateHistoricalChangeDto } from './dto/update-historical-change.dto';

@Injectable()
export class HistoricalChangesService {
  create(createHistoricalChangeDto: CreateHistoricalChangeDto) {
    return 'This action adds a new historicalChange';
  }

  findAll() {
    return `This action returns all historicalChanges`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historicalChange`;
  }

  update(id: number, updateHistoricalChangeDto: UpdateHistoricalChangeDto) {
    return `This action updates a #${id} historicalChange`;
  }

  remove(id: number) {
    return `This action removes a #${id} historicalChange`;
  }
}
