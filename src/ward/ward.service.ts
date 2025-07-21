import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentService } from 'src/department/department.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddWardDto } from './dtos/add-ward.dto';
import { UpdateWardDto } from './dtos/update-ward.dto';

@Injectable()
export class WardService {
  constructor(
    private prisma: PrismaService,
    private departmentService: DepartmentService
  ){}

  async findByNumber(wardNumber: number){
    const find = await this.prisma.ward.findMany({
      where:{
        number: wardNumber
      },
      include:{
        Department: {
          select:{
            id: true,
            isActive: true
          }
        }
      }
    })
    return find
  }
  async findByNumberAndDepartment(wardNumber: number, departmentId: number){
    const find = await this.prisma.ward.findFirst({
      where:{
        number:wardNumber,
        departmentId
      }
    })
    return find
  }
  private async existingWards(departmentId: number,startNumber: number, endNumber: number ){
    const existingWards = await this.prisma.ward.findMany({
      where: {
        departmentId,
        number: {
          gte: startNumber,
          lte: endNumber,
        },
      },
    });
    return existingWards
  
  }

  async addWardsInRange(departmentId:number, startNumber: number, endNumber: number ){
    if (startNumber > endNumber) {
      throw new BadRequestException('Start number must be less than or equal to end number');
    }
    const department = await this.departmentService.findById(departmentId);
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    const existingWards = await this.existingWards(departmentId,startNumber,endNumber)
    if (existingWards.length > 0) {
      const existingNumbers = existingWards.map(w => w.number).join(', ');
      throw new BadRequestException(`Wards with numbers [${existingNumbers}] already exist in this department`);
    }

    const wardsToCreate = [];
    for (let number = startNumber; number <= endNumber; number++) {
      wardsToCreate.push({
        departmentId,
        number,
      });
    }

    const createdWards = await this.prisma.ward.createMany({
      data: wardsToCreate,
    });
    
    return createdWards;
  }

  async findById(id:number){
    const find = await this.prisma.ward.findUnique({
      where:{
        id
      }
    })
    return find
  }

  async addWard(wardData: AddWardDto){
    const findDepartment = await this.departmentService.findById(wardData.departmentId)
    if(!findDepartment){
      throw new NotFoundException("Department not found")
    }
    const wardsWithSameNumber = await this.findByNumber(wardData.number);

    const wardInSameDepartment = wardsWithSameNumber.find(
    ward => ward.departmentId === wardData.departmentId
    );

  if (wardInSameDepartment) {
    throw new BadRequestException(`Ward with number ${wardData.number} already exists in this department`);
  }
    const addWard = await this.prisma.ward.create({
      data:{
        ...wardData
      }
    })
    return addWard
  }

  async updateWard(wardData:UpdateWardDto, wardId: number){
    const findWard = await this.findById(wardId)
    if(!findWard){
      throw new NotFoundException("Ward not found")
    }
    const findDepartment = await this.departmentService.findById(wardData.departmentId)
    if(!findDepartment){
      throw new NotFoundException("Department not found")
    }
    const findWardDetails = await this.findByNumber(wardData.number)
    if(findWard.departmentId === findDepartment.id){
      throw new BadRequestException(`Ward with number ${wardData.number} already exists`)
    }
    const updateWard = await this.prisma.ward.update({
      where:{
        id:wardId
      },
      data:{
        ...wardData
      }
    })
    return updateWard
  }
async updateWardStatus(wardId: number, isActive: boolean) {
    const findWard = await this.findById(wardId);
    if (!findWard) {
      throw new NotFoundException('Ward not found');
    }

    const updatedWard = await this.prisma.ward.update({
      where: {
        id: wardId,
      },
      data: {
        isActive: isActive, 
      },
    });
    return updatedWard;
  }

  async findByDepartment(departmentId: number){
    const find = await this.prisma.ward.findMany({
      where:{
        departmentId
      },
      include:{
        WardPlaces: true
      },
      orderBy:{
        number: 'asc'
      }
    })
    return find
  }

}
