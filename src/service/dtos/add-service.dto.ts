import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
export class AddServiceDto{
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsNumber()
  @IsNotEmpty()
  positionId: number
}