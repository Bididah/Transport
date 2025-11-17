import { IsEmail, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsString()
  @Length(3, 50)
  password: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
