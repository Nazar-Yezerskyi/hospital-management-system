import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
export class UpdateMedicineDto{
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  dose?: string

  @IsNumber()
  @IsOptional()
  quantity?: number

  @IsNumber()
  @IsOptional()
  totalQuantity?: number

  @IsString()
  @IsOptional()
  unit?: string

  @IsString()
  @IsOptional()
  manufacturer?: string

  @IsNumber()
  @IsOptional()
  totalPrice?:number

  @IsString()
  @IsOptional()
  invoiceNumber?: string

  @IsDateString()
  @IsOptional()
  expirationDate?: string
}