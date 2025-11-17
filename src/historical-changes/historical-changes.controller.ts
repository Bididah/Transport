import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoricalChangesService } from './historical-changes.service';
import { CreateHistoricalChangeDto } from './dto/create-historical-change.dto';
import { UpdateHistoricalChangeDto } from './dto/update-historical-change.dto';

@Controller('historical-changes')
export class HistoricalChangesController {
  constructor(private readonly historicalChangesService: HistoricalChangesService) {}

  @Post()
  create(@Body() createHistoricalChangeDto: CreateHistoricalChangeDto) {
    return this.historicalChangesService.create(createHistoricalChangeDto);
  }

  @Get()
  findAll() {
    return this.historicalChangesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historicalChangesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoricalChangeDto: UpdateHistoricalChangeDto) {
    return this.historicalChangesService.update(+id, updateHistoricalChangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historicalChangesService.remove(+id);
  }
}
