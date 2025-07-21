import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PositionService } from 'src/position/position.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AddServiceDto } from './dtos/add-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private positionService: PositionService
  ){}

  async findServiceByName(name: string){
    const find = await this.prisma.service.findFirst({
      where:{
        name:{
          contains: name,
          mode: 'insensitive'
        }
      }
    })
    return find
  }

  async findById(id:number){
    const find = await this.prisma.service.findUnique({
      where:{
        id
      },
      include:{
        position:{
          select: {
            specialty: true
          }
        }
      }
    })
    return find
  }
  async addService(serviceData:AddServiceDto){
    const findService = await this.findServiceByName(serviceData.name)
    if(findService){
      throw new ConflictException('Service already exists');
    }
    const addService = await this.prisma.service.create({
      data:{
        ...serviceData
      }
    })
    return addService
  }

  async updateService(serviceData: UpdateServiceDto, serviceId: number){
    const findServiceById = await this.findById(serviceId)
    if(!findServiceById){
      throw new NotFoundException('Service not found')
    }
    if(serviceData.name){
      const findByName = await this.findServiceByName(serviceData.name)
      if(findByName){
        throw new ConflictException('Service already exists');
      }
    }
    const updateService = await this.prisma.service.update({
      where:{
        id: findServiceById.id
      },
      data:{
        ...serviceData
      }
    })
    return updateService
  } 
  async deleteService(serviceId: number){
    const findServiceById = await this.findById(serviceId)
    if(!findServiceById){
      throw new NotFoundException('Service not found')
    }
    const deleteService = await this.prisma.service.delete({
      where:{
        id: findServiceById.id
      }
    })
    return deleteService
  }

  async findBySpecialty(specialty: string){
    const findPosition = await this.positionService.findBySpecialization(specialty)
    if(!findPosition){
      throw new NotFoundException('Specialty not found')
    }
    const find = await this.prisma.service.findMany({
      where:{
        position:{
          specialty: specialty
        }
      }
    })
    return find
  }

async showServices() {
  const services = await this.prisma.service.findMany({
    orderBy: {
      position: {
        id: 'asc' 
      }
    },
    include: {
      position: true 
    }
  });
  return services;
}

}
