import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateWardDto{
  @IsNumber()
  @IsOptional()
  number?: number

  @IsString()
  @IsOptional()
  type?: string

  @IsNumber()
  @IsNotEmpty()
  departmentId: number
}