import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class AddMedicineDto{
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  dose: string

  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @IsNumber()
  @IsNotEmpty()
  totalQuantity: number

  @IsString()
  @IsNotEmpty()
  unit: string

  @IsString()
  @IsOptional()
  manufacturer?: string

  @IsNumber()
  @IsNotEmpty()
  totalPrice:number

  @IsString()
  @IsNotEmpty()
  invoiceNumber: string

  @IsDateString()
  @IsNotEmpty()
  expirationDate: string
}