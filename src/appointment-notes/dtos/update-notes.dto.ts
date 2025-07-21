import { IsOptional, IsString } from "class-validator";
export class UpdateNotesDto{
  
  @IsString()
  @IsOptional()
  complains?: string;

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
}