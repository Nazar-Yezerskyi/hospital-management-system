import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class SignInDto {
  @IsString()
  @IsEmail()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}