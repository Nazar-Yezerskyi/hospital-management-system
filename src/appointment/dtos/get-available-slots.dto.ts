
import { IsDateString, IsString } from 'class-validator';

export class GetAvailableSlotsDto {
  @IsString()
  doctorId: string;

  @IsDateString()
  date: string;
}
