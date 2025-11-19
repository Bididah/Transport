import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { GenericEntity } from 'src/utils/generic-entity';


export enum PortMode {
  AIR = 'AIR',
  SEA = 'SEA',
  ROAD = 'ROAD',
  RAIL = 'RAIL',
}

export enum ServiceType {
  STANDARD = 'STANDARD',
  EXPRESS = ' EXPRESS',
  SAME_DAY = 'SAME_DAY',
}

export enum DeliveryType {
  DOOR_TO_DOOR = 'DOOR_TO_DOOR',
  DOOR_TO_OFFICE = 'DOOR_TO_OFFICE',
  OFFICE_TO_DOOR = 'OFFICE_TO_DOOR',
  OFFICE_TO_OFFICE = 'OFFICE_TO_OFFICE',
}

export enum BillingType {
  SENDER = 'SENDER',
  RECEIVER = 'RECEIVER',
  THIRD_PARTY = 'THIRD_PARTY',
}

@Entity('shipments')
export class Shipment extends GenericEntity {
  @PrimaryGeneratedColumn()
  declare id: number;

  @ManyToOne(() => Client, { eager: true })
  client: Client;

  @Column()
  destinationCity: string;

  @Column()
  recipientAddress: string;

  @Column()
  recipientPhone: string;

  @Column()
  recipientName: string;

  @Column()
  packageCount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  weight: number;

  @Column({
    type: 'simple-enum',
    enum: PortMode,
    nullable: true,
  })
  portMode: PortMode;

  @Column({
    type: 'simple-enum',
    enum: ServiceType,
    default: ServiceType.STANDARD,
  })
  serviceType: ServiceType;

  @Column({
    type: 'simple-enum',
    enum: DeliveryType,
    default: DeliveryType.DOOR_TO_DOOR,
  })
  deliveryType: DeliveryType;

  @Column({
    type: 'simple-enum',
    enum: BillingType,
    default: BillingType.SENDER,
  })
  billingType: BillingType;
}
