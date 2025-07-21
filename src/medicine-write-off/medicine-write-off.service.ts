import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MedicineService } from 'src/medicine/medicine.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWriteOffDto } from './dtos/create-write-off.dto';
import { UpdateWriteOffDto } from './dtos/update-write-off.dto';
import { ReportDateDto } from 'src/medicine/dtos/report.dto';

@Injectable()
export class MedicineWriteOffService {
  constructor(
    private prisma: PrismaService,
    private medicineService: MedicineService
  ){}

  async findById(id:number){
    const find = await this.prisma.medicineWriteOff.findUnique({
      where:{
        id
      }
    })
    return find
  }

  async createWriteOff(medicineDate: CreateWriteOffDto){
    const findMedicine = await this.medicineService.findById(medicineDate.medicineId)
    if(!findMedicine){
      throw new NotFoundException("Medicine not found")
    }
    const pricePerUnit = findMedicine.totalPrice / findMedicine.totalQuantity;
    const totalWriteOffPrice = medicineDate.quantity * pricePerUnit;

    const writeOff = await this.prisma.medicineWriteOff.create({
      data:{
        ...medicineDate,
        totalWriteOffPrice
      }
    })
    const updatedQuantity = findMedicine.quantity - medicineDate.quantity;

    if (updatedQuantity < 0) {
        throw new BadRequestException('Not enough medicine in stock');
    }
    await this.medicineService.updateMedicine({ quantity: updatedQuantity }, findMedicine.id);

    return writeOff
  }

  async updateWriteOff(writeOffId:number, updateData: UpdateWriteOffDto ){
    const findRecord = await this.findById(writeOffId)
    if(!findRecord){
      throw new NotFoundException("Rocord not found")
    }

    const update = await this.prisma.medicineWriteOff.update({
      where:{
        id:writeOffId
      },
      data:{
        ...updateData
      }
    })
    return update
  }
  async getWriteOffMedicinesReport(period: ReportDateDto) {
    const { startDate, endDate } = period;
    console.log(period)
    const end = new Date(endDate);
end.setHours(23, 59, 59, 999);
    const report = await this.prisma.medicineWriteOff.findMany({
      where: {
        writeOffDate: {
          gte: new Date(startDate),
          lte: end,
        },
      },
      include:{
        medicine: true
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    return report
  }
}
