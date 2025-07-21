import { IsNotEmpty, IsNumber } from "class-validator";
export class AddHospitalizationDto{
  @IsNumber()
  @IsNotEmpty()
  patientId: number

  @IsNumber()
  @IsNotEmpty()
  wardPlaceId: number

  @IsNumber()
  @IsNotEmpty()
  appointmentId: number

}