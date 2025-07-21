import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateWriteOffDto{
  @IsNumber()
  @IsNotEmpty()
  medicineId: number

  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @IsString()
  @IsNotEmpty()
  reason: string
}