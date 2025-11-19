import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { PortMode, ServiceType, DeliveryType, BillingType } from '../entities/shipment.entity';

export class CreateShipmentDto {
  @IsString()
  clientId: string;

  @IsString()
  creatorId: string;

  @IsString()
  @IsNotEmpty()
  destinationCity: string;

  @IsString()
  @IsNotEmpty()
  recipientAddress: string;

  @IsString()
  @IsNotEmpty()
  recipientPhone: string;

  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @IsNumber()
  @IsPositive()
  packageCount: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  weight: number;

  @IsOptional()
  @IsEnum(PortMode)
  portMode?: PortMode;

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @IsEnum(DeliveryType)
  deliveryType?: DeliveryType;

  @IsOptional()
  @IsEnum(BillingType)
  billingType?: BillingType;
}
