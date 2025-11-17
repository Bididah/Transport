import { Module } from '@nestjs/common';
import { HistoricalChangesService } from './historical-changes.service';
import { HistoricalChangesController } from './historical-changes.controller';

@Module({
  controllers: [HistoricalChangesController],
  providers: [HistoricalChangesService],
})
export class HistoricalChangesModule {}
