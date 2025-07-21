import {
  IsDateString, IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  Matches
} from 'class-validator';

export class CreateAppointmentDto {

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format'
  })
  @IsNotEmpty()
  time: string;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsOptional()
  @IsString()
  referralCode?: string;
  
  @IsString()
  @IsNotEmpty()
  paymentMethod: string

  @IsString()
  @IsNotEmpty()
  successUrl: string;
}
