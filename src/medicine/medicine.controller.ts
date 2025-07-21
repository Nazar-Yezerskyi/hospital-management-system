import { Body, Controller, Param, Post, Put, Get, Query } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { AddMedicineDto } from './dtos/add-medicine.dto';
import { UpdateMedicineDto } from './dtos/update-medicine.dto';
import { ReportDateDto } from './dtos/report.dto';

@Controller('medicine')
export class MedicineController {
  constructor(private medicineService: MedicineService){}

  @Post()
  async addMedicine(@Body() data: AddMedicineDto){
    const addMedicine = await this.medicineService.addMedicine(data)
    return addMedicine
  }

  @Put(":medicineId")
  async updateMedicine(@Body() data: UpdateMedicineDto, @Param("medicineId") medicineId: string): Promise<{ id: number; name: string; dose: string; quantity: number; totalQuantity: number; unit: string; manufacturer: string | null; expirationDate: Date; totalPrice: number; invoiceNumber: string; createdAt: Date; updatedAt: Date; }>{
    const updateMedicine = this.medicineService.updateMedicine(data, +medicineId)
    return updateMedicine
  }
  @Get('byName/:name')
  async getByName(@Param('name') name: string){
    const find = await this.medicineService.getByName(name)
    return find
  }

  @Get()
  async showMedicine(){
    const find = await this.medicineService.showMedicine()
    return find
  }
  @Get('incoming')
  async getIncomingReport(@Query() query: ReportDateDto) {
    return this.medicineService.getIncomingMedicinesReport(query);
  }
  @Get('/all')
  async getAll(){
    const find = await this.medicineService.getAllMedicine()
    return find
  }

}
