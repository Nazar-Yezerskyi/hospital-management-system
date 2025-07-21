import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class AddStaffDetailsDto{
  @IsDateString()
  @IsNotEmpty()
  hireDate: string;

  @IsDateString()
  @IsOptional()
  firedDate?: string

  @IsNumber()
  @IsNotEmpty()
  salaryMultiplier: number

  @IsNumber()
  @IsOptional()
  officeNumber?: number

  @IsNumber()
  @IsNotEmpty()
  userId: number

  @IsNumber()
  @IsOptional()
  departmentId?: number
}