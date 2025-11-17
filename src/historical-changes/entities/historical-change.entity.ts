import { BaseEntity } from 'src/utils/base-entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(["entityName", "entityId"], { unique: false })
@Entity()
export class HistoricalChange extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  declare id: string;


  @Column({ select: false })
  entityName: string;

  @Column({ select: false })
  entityId: string;

  @Column()
  fieldName: string;

  @Column()
  transID: string;

  @Column({ nullable: true })
  oldValue: string;

  @Column()
  newValue: string;

  @Column()
  event: string
}
