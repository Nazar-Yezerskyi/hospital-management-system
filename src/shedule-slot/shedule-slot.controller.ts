import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SheduleSlotService } from './shedule-slot.service';
import { CreateSheduleSlotDto } from './dtos/create-shedule-slot.dto';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';
import { FindSheduleSlotDto } from './dtos/find-schedule-slot.dto';

@Controller('shedule-slot')
export class SheduleSlotController {
  constructor(
    private shedulesSlotService: SheduleSlotService
  ){}

  @Post()
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async addSlot(@Body() data: CreateSheduleSlotDto){
    const addSlot = await this.shedulesSlotService.createSlot(data)
    return addSlot
  }

  @Get()
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async findSlot(@Query() query: FindSheduleSlotDto) {
    return this.shedulesSlotService.findSlot(query);
  }

}
