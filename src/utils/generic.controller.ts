import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { GenericService } from './generic-service';
import { GenericEntity } from './generic-entity';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { GetUser } from './get-user.decorator';

export class GenericController<T extends GenericEntity & { id: number | string }> {
  constructor(private readonly genericService: GenericService<T>) {}

  @Post()
  create(@Body() createDto: any, @GetUser() user?: any) {
    return this.genericService.create({
      createdBy: user?.userId,
      ...createDto,
    } as unknown as DeepPartial<T>);
  }

  @Post('/find')
  @HttpCode(200)
  findAllWith(@Body() query: any) {
    const queryOptions = {
      where: query.options,
      relations: query?.relations,
      select: query?.select,
      withDeleted: query?.withDeleted,
      skip: query?.skip,
      take: query?.take,
      order: query?.order,
    };
    return this.genericService.findAll(queryOptions as any);
  }

  @Get()
  findAll(options?) {
    return this.genericService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const options = { id: +id } as FindOptionsWhere<T>;
    return this.genericService.findOne({ where: options });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @GetUser() user?: any,
  ) {
    const options = { id: +id } as FindOptionsWhere<T>;
    return this.genericService.update(
      updateDto as unknown as DeepPartial<T>,
      {
        where: options,
      },
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const options = { id: +id } as FindOptionsWhere<T>;
    return this.genericService.remove({ where: options });
  }
}
