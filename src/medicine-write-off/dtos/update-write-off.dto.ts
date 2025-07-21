import { IsNumber, IsOptional, IsString } from "class-validator";
export class UpdateWriteOffDto{

  @IsString()
  @IsOptional()
  reason?: string

  @IsNumber()
  @IsOptional()
  quantity?: number
}