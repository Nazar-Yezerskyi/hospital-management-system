import { IsEnum } from 'class-validator';
import { AppointmentStatus } from 'src/enums/appointment-status.enum';


export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus, {
    message: 'Status must be a valid AppointmentStatus enum value',
  })
  status: AppointmentStatus;
}
