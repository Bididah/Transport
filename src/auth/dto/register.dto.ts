import { IsEmail, IsPhoneNumber, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
