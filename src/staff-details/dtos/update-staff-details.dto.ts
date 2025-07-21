import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateStaffDetailsDto{
  @IsDateString()
  @IsOptional()
  hireDate?: string;

  @IsDateString()
  @IsOptional()
  firedDate?: string

  @IsNumber()
  @IsOptional()
  salaryMultiplier?: number

  @IsNumber()
  @IsOptional()
  officeNumber?: number

  @IsNumber()
  @IsNotEmpty()
  positionId: number

  @IsNumber()
  @IsOptional()
  departmentId?: number
}