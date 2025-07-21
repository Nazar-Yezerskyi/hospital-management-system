import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MedicineWriteOffService } from './medicine-write-off.service';
import { IsWareHouseManagerGuard } from 'src/guards/is-warehouse-manager.guard';
import { CreateWriteOffDto } from './dtos/create-write-off.dto';
import { UpdateWriteOffDto } from './dtos/update-write-off.dto';
import { ReportDateDto } from 'src/medicine/dtos/report.dto';

@Controller('medicine-write-off')
export class MedicineWriteOffController {
  constructor(private medicineWriteOffService: MedicineWriteOffService){}

  @Post()
  @UseGuards(IsWareHouseManagerGuard)
  async createWriteOff(@Body() data:CreateWriteOffDto ){
    const createWriteOff = this.medicineWriteOffService.createWriteOff(data)
    return createWriteOff
  }

  @Put(":recordId")
  @UseGuards(IsWareHouseManagerGuard)
  async updateWriteOff(@Param("recordId") recordId: string, @Body() data: UpdateWriteOffDto){
    const update = this.medicineWriteOffService.updateWriteOff(+recordId,data)
    return update
  }
  @Get('write-off')
  async getWriteOffReport(@Query() query: ReportDateDto) {
    return await this.medicineWriteOffService.getWriteOffMedicinesReport(query);
  }
}
