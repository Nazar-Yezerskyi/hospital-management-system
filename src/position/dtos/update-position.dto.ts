import { IsNumber, IsOptional, IsString } from "class-validator";
export class UpdatePositionDto{
  @IsString()
  @IsOptional()
  position?: string

  @IsString()
  @IsOptional()
  responsibilities?: string

  @IsNumber()
  @IsOptional()
  baseSalary?: number;

  @IsString()
  @IsOptional()
  specialty?: string
}