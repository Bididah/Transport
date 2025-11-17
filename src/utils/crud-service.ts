/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  DataSource,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { HistoricalChange } from 'src/historical-changes/entities/historical-change.entity';
import { log } from 'console';
import { generateUUID, groupByField } from './random-number';

@Injectable()
export class CrudService<T extends BaseEntity> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne(options);
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }
    return entity;
  }

  async create(createDto: DeepPartial<T>): Promise<T> {
    await this.checkUniqueFields(createDto);
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async update(
    updateDto: DeepPartial<T>,
    options: FindOneOptions<T>,
    user?: any,
  ): Promise<T> {
    let entity = await this.findOne(options); // Check if the entity exists
    const changes: HistoricalChange[] = [];
    const transID = generateUUID();

    for (const key in updateDto) {
      if (updateDto.hasOwnProperty(key)) {
        if (entity[key] !== updateDto[key]) {
          changes.push(
            this.dataSource.getRepository(HistoricalChange).create({
              entityId: entity.id as string,
              entityName: this.getEntityName(),
              oldValue: `${entity[key]}`,
              fieldName: key,
              newValue: `${updateDto[key]}`,
              transID,
              event: 'update',
            }),
          );
        }
      }
    }

    Object.assign(entity, updateDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      entity = await queryRunner.manager.save(entity);
      await queryRunner.manager.save(changes);
      await queryRunner.commitTransaction();
      return entity;
    } catch (err) {
      log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async remove(options: FindOneOptions<T>): Promise<void> {
    const entity = await this.findOne(options); // Load entity
    // Check if entity supports soft-delete
    const hasDeletedAt = 'deletedAt' in entity;

    if (hasDeletedAt) {
      await this.repository.softRemove(entity);
    } else {
      await this.repository.remove(entity);
    }
  }

  getEntityName(): string {
    return this.repository.metadata.targetName;
  }

  getUniqueFields(createDto: DeepPartial<T>): DeepPartial<T>[] {
    const uniqueConstraints = this.repository.metadata.uniques;

    return uniqueConstraints.map((constraint) => {
      const fields: Record<string, any> = {};
      for (const column of constraint.columns) {
        const key = column.propertyName;
        fields[key] = createDto[key];
      }
      return fields as any;
    });
  }

  async checkUniqueFields(createDto: DeepPartial<T>): Promise<void> {
    const uniqueChecks = this.getUniqueFields(createDto);
    for (const uniqueSet of uniqueChecks) {
      const existing = await this.repository.findOne({
        where: uniqueSet as any,
      });

      if (existing) {
        const fields = Object.keys(uniqueSet).filter(
          (key) => createDto[key] === existing[key],
        );
        throw new BadRequestException(`Duplicate fields: ${fields.join(', ')}`);
      }
    }
  }
}
