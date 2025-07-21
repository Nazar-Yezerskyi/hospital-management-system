import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddWardDto{
  @IsNumber()
  @IsNotEmpty()
  number: number

  @IsString()
  @IsOptional()
  type?: string

  @IsNumber()
  @IsNotEmpty()
  departmentId: number
}