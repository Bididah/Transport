import { Exclude } from 'class-transformer';
import { GenericEntity } from 'src/utils/generic-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({ type: 'nvarchar', length: 255, nullable: true })
  refreshTokenHash: string | null;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  lastLoginDate: Date;

  @Column({ nullable: true })
  role: string;
}
