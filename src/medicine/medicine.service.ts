import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMedicineDto } from './dtos/add-medicine.dto';
import { UpdateMedicineDto } from './dtos/update-medicine.dto';
import { ReportDateDto } from './dtos/report.dto';

@Injectable()
export class MedicineService {
  constructor(
    private prisma: PrismaService
  ){}
  async findById(id:number){
    const find = await this.prisma.medicine.findUnique({
      where:{
        id
      }
    })
    return find
  }
  async findRecord(name:string, invoiceNumber:string){
    const find = await this.prisma.medicine.findFirst({
      where:{
        name:{
          contains: name,
          mode: 'insensitive'
        },
        invoiceNumber:{
          contains: invoiceNumber,
          mode:"insensitive"
        }
      }
    })
    return find
  }

  async addMedicine(medicineData: AddMedicineDto){
    const findRecord = await this.findRecord(medicineData.name, medicineData.invoiceNumber)
    if(findRecord){
      throw new BadRequestException('Record already exists')
    }
    const addMedicine = await this.prisma.medicine.create({
      data:{
        ...medicineData,
        expirationDate: new Date(medicineData.expirationDate)
      }
    })
    return addMedicine
  }

  async updateMedicine(medicineData:UpdateMedicineDto, medicineId: number ){
    const find = await this.findById(medicineId)
    if(!find){
      throw new NotFoundException("Record not found")
    }
    const update = await this.prisma.medicine.update({
      where:{
        id: medicineId
      },
      data:{
        ...medicineData
      }
    })
    return update
  }

  async showMedicine(){
    const find = await this.prisma.medicine.findMany({
      where:{
        expirationDate:{
          gt: new Date()
        },
        quantity:{
          gt: 0
        }
      }
    })
    return find
  }
  
  async getByName(name: string) {
    const find = await this.prisma.medicine.findMany({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        }
      }
    });
    return find;
  }
  async getAllMedicine(){
    const find = await this.prisma.medicine.findMany({
      where:{
        expirationDate:{
          gt: new Date()
        },
        quantity:{
          gt: 0
        }
      },
      orderBy:{
        expirationDate: 'asc'
      }
    })
    return find
  }
  async getIncomingMedicinesReport(period: ReportDateDto) {
    const { startDate, endDate } = period;

    return this.prisma.medicine.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        }
      },
      select: {
        id: true,
        name: true,
        dose: true,
        quantity: true,
        unit: true,
        manufacturer: true,
        invoiceNumber: true,
        createdAt: true,
        updatedAt: true,
        totalPrice: true
      },
      orderBy: {
        createdAt: 'asc',
      },
  });
  }

}
