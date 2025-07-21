import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class FindWorkSheduleDto{
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM format (e.g. 09:30, 14:00)',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM format (e.g. 10:30, 18:00)',
  })
  endTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
      /^((Mon|Tue|Wed|Thu|Fri|Sat|Sun)(-(Mon|Tue|Wed|Thu|Fri|Sat|Sun))?)(, ?(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(-(Mon|Tue|Wed|Thu|Fri|Sat|Sun))?)*$/,
      {
        message:
          'dayOfWeek must be in format like "Mon", "Mon-Wed", or "Mon,Wed,Fri"',
      },
    )
  dayOfWeek: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number
}
