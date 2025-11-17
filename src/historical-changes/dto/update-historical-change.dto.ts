import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoricalChangeDto } from './create-historical-change.dto';

export class UpdateHistoricalChangeDto extends PartialType(CreateHistoricalChangeDto) {}
