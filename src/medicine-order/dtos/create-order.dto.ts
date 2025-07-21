import { IsNotEmpty, IsNumber } from "class-validator";
export class CreateOrderDto{
  @IsNumber()
  @IsNotEmpty()
  medicineId:number

  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @IsNumber()
  @IsNotEmpty()
  departmentId:number

}