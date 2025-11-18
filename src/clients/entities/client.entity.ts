import { GenericEntity } from 'src/utils/generic-entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('clients')
export class Client extends GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  idNumber: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  addressLine: string;

  @Column()
  city: string;

  @Column()
  region: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  postalCode: string;
}
