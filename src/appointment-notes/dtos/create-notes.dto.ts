import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateNotesDto{
  
  @IsString()
  @IsNotEmpty()
  complains: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsString()
  @IsOptional()
  predscribedMeds?: string

  @IsString()
  @IsOptional()
  additionalNotes?: string

  @IsString()
  @IsOptional()
  diagnosis?: string

  @IsNumber()
  @IsNotEmpty()
  appointmentId:number

}