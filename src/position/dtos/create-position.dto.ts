import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreatePositionDto{
  @IsString()
  @IsNotEmpty()
  position: string

  @IsString()
  @IsNotEmpty()
  responsibilities: string

  @IsNumber()
  @IsNotEmpty()
  baseSalary: number;

  @IsString()
  @IsOptional()
  specialty?: string
}