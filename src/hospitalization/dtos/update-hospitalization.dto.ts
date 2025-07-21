import { IsDateString, IsNotEmpty } from "class-validator";
export class UpdateHospitalizationDto{
  @IsDateString()
  @IsNotEmpty()
  dischargeDate: string

}