import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WardService } from 'src/ward/ward.service';

@Injectable()
export class WardPlaceService {
  constructor(
    private prisma: PrismaService,
    private wardService: WardService
  ){}

  async findById(id:number){
    const find = await this.prisma.wardPlace.findUnique({
      where:{
        id
      },
      include:{
        Ward:{
          include:{
            Department: true
          }
        }
      }
    })
    return find
  }

  async findRecord(wardId:number, placeNumber:number){
    const find = await this.prisma.wardPlace.findFirst({
      where: {
        wardId,
        placeNumber
      }
    });
    return find
  }

  async addWardPlace(placeNumber: number, departmentId:number, wardNumber: number){
    const findWard = await this.wardService.findByNumberAndDepartment(wardNumber,departmentId)
    if(!findWard){
      throw new NotFoundException("Ward not found in this department")
    }
    const placesInWard = await this.findRecord(findWard.id, placeNumber)


    if (placesInWard) {
      throw new ConflictException("Place already exists in this ward");
    }

    const addPlace = await this.prisma.wardPlace.create({
      data: {
        placeNumber,
        wardId: findWard.id,
      },
    });
    return addPlace
  }

  async existingPlaces(startNumber:number, endNumber:number, wardId:number){
    const existingPlaces = await this.prisma.wardPlace.findMany({
      where:{
        wardId,
        placeNumber:{
          gte: startNumber,
          lte:endNumber
        }
      }
    })
    return existingPlaces
  }
  async addWardPlaces(startNumber:number, endNumber: number,  departmentId:number, wardNumber: number){
    const findWard = await this.wardService.findByNumberAndDepartment(wardNumber, departmentId);
    if (!findWard) {
      throw new NotFoundException("Ward not found in this department");
    }  
    const existingPlaces = await this.existingPlaces(startNumber,endNumber,findWard.id)
    if (existingPlaces.length > 0) {
      const existingNumbers = existingPlaces.map(p => p.placeNumber).join(', ');
      throw new ConflictException(`Places already exist in this ward: ${existingNumbers}`);
    }

    const dataToCreate = Array.from({ length: endNumber - startNumber + 1 }, (_, i) => ({
      placeNumber: startNumber + i,
      wardId: findWard.id,
    }));
  
    return this.prisma.wardPlace.createMany({
      data: dataToCreate,
    });
  
  }

  async updateWardIsFree(isFree: string, placeNumber:number, wardId:number){
    const findPlace = await this.findRecord(wardId,placeNumber)
    if(!findPlace){
      throw new NotFoundException("Place not found")
    }
    const updateData = isFree === "true"
    const update = await this.prisma.wardPlace.update({
      where:{
        id:findPlace.id
      },
      data:{
        isFree: updateData
      }
    })
    return update
  }

  async deletePlace(placeId: number){
    const deletePlace = await this.prisma.wardPlace.delete({
      where:{
        id:placeId
      }
    })
    return deletePlace
  }

  async findFreePlacesByWard(wardId: number){
    const find = await this.prisma.wardPlace.findMany({
      where:{
        wardId,
        isFree: true
      }
    })
    return find
  }

}
