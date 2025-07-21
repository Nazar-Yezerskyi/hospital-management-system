import { RequestType } from "@prisma/client";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class AddRequestDto{
  @IsString()
  @IsNotEmpty()
  requestType: RequestType
   
  @IsNumber()
  @IsNotEmpty()
  userId:number

  @IsString()
  @IsNotEmpty()
  description:string

  @IsDateString()
  @IsOptional()
  startDate?: string

  @IsDateString()
  @IsOptional()
  endDate?: string

}