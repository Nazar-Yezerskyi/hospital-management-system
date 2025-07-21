// src/wards/dto/update-ward-status.dto.ts (або десь у ваших DTOs)
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateWardStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}