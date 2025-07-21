import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePositionDto } from './dtos/create-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { PositionEnum } from 'src/enums/position.enum';

@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService){}

  async findBySpecialization(specialty: string) {
    return this.prisma.position.findFirst({
      where: {
        specialty: {
          equals: specialty,
          mode: 'insensitive',
        },
      },
    });
  }


  async findById(id: number){
    const find = await this.prisma.position.findUnique({
      where:{
        id
      }
    })
    return find
  }

  async findByName(position: string){
    const find = await this.prisma.position.findFirst({
      where:{
        position
      }
    })
    return find
  }

  async addPosition(positionData: CreatePositionDto){
    const findPosition = await this.findByName(positionData.position)
    if(findPosition){
      throw new BadRequestException('Position already exists')
    }
    const addPosition = await this.prisma.position.create({
      data:{
        ...positionData
      }
    })
    return addPosition
  }

  async updatePosition(positionData: UpdatePositionDto, positionId: number){
    console.log(positionId)
    const find = await this.findById(positionId)
    if(!find){
      throw new NotFoundException('Position not found')
    }
    const updatePosition = await this.prisma.position.update({
      where:{
        id:positionId
      },
      data:{
        ...positionData
      }
    })
    return updatePosition
  }

  async deletePosition(positionId: number){
    const find = await this.findById(positionId)
    if(!find){
      throw new NotFoundException('Position not found')
    }
    return await this.prisma.position.delete({
      where:{
        id: positionId
      }
    })
  }

  async showAllDoctorSpeialty(){
    const show = await this.prisma.position.findMany({
      where:{
        position: PositionEnum.DOCTOR
      },
      select:{
        specialty: true,
        id: true
      }
    })
    return show
  }

  async showSpecialty(){
    const get = await this.prisma.position.findMany(
      {
select: {
      id: true,
      position: true,
      responsibilities: true,
      baseSalary: true,
      specialty: true, 
    }
      }
    )
    return get
  }
}
