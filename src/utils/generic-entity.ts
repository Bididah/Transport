import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class GenericEntity {
  id: number | string;

  // @PrimaryGeneratedColumn('uuid') // Adding a second primary key column
  // secondId: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: number;
}
