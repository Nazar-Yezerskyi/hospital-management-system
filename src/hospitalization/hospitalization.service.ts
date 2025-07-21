import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { WardPlaceService } from 'src/ward-place/ward-place.service';
import { AddHospitalizationDto } from './dtos/add-hospitalization.dto';
import { PositionEnum } from 'src/enums/position.enum';
import { startOfDay, subDays, endOfDay } from 'date-fns';

@Injectable()
export class HospitalizationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private wardPlaceService: WardPlaceService
  ){}

  async findById(id:number){
    const find = await this.prisma.hospitalization.findUnique({
      where:{
        id
      }
    })
    return find
  }
  async findRecord(patientId: number) {
    const find = await this.prisma.hospitalization.findFirst({
      where: {
        patientId,
        dischargeDate: null,
      },
    });
  
    return find;
  }

  async addHospitalization(data:AddHospitalizationDto, doctorId:number){
    const findUser = await this.userService.findPatientById(data.patientId)
    if(!findUser){
      throw new NotFoundException("User not found")
    }
    const findDoctor = await this.userService.findUserById(doctorId)
    if(findDoctor.StaffDetails.Position.position !== PositionEnum.DOCTOR){
      throw new BadRequestException('User is not a doctor');
    }
    const findWardPlace = await this.wardPlaceService.findById(data.wardPlaceId)
    if(findWardPlace.isFree !== true){
      throw new BadRequestException('Ward place is not available');
    }

    const addHospitalization = await this.prisma.hospitalization.create({
      data:{
        ...data,
        doctorId
      }
    })
    await this.wardPlaceService.updateWardIsFree('false',findWardPlace.placeNumber,findWardPlace.Ward.number)
    return addHospitalization
  }

  async dischargeThePatient(hospitalizationId: number, doctorId:number){
    const find = await this.findById(hospitalizationId)
    if(!find){
      throw new NotFoundException("Record not found")
    }
    if (find.doctorId !== doctorId) {
      throw new ForbiddenException('You do not have permission to access this hospitalization record');
    }
    if (find.dischargeDate) {
      throw new BadRequestException('Patient is already discharged');
    }
    const findWardPlace = await this.wardPlaceService.findById(find.wardPlaceId)

    const dischargeThePatient = await this.prisma.hospitalization.update({
      where:{
        id: find.id
      },
      data:{
        dischargeDate: new Date()
      }
    })
    await this.wardPlaceService.updateWardIsFree("true",findWardPlace.placeNumber, findWardPlace.Ward.number);
    return dischargeThePatient
  }

  async findHospitalizationByUser(userId: number){
    const find = await this.prisma.hospitalization.findMany({
      where:{
        patientId: userId
      },
      include:{
        wardPlace: {
          include:{
            Ward:{
              include:{
                Department:{
                 select:{
                  name:true
                 } 
                }
              }
            }
          }
        },
        doctor:{
          select:{
            firstName: true,
            lastName: true
          }
        },
        patient:{
          select:{
            firstName: true,
            lastName: true
          }
        }
      }
    })
    return find
  }

  async findHospitalizationByDoctor(doctorId: number){
    const find = await this.prisma.hospitalization.findMany({
      where:{
       doctorId,
       dischargeDate: null
      },
      orderBy: {
      createdAt: 'desc',
      },
      include:{
        wardPlace: {
          include:{
            Ward:{
              include:{
                Department:{
                 select:{
                  name:true
                 } 
                }
              }
            }
          }
        },
        appointment:{
          include: {
            AppointmentNotes: {
              select: {
                treatment: true
              }
            }
          }
        },
        patient:{
          select:{
            firstName: true,
            lastName: true
          }
        }
      }
    })
    return find
  }

   async getOccupancyReport(
    departmentId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const now = new Date();
    const start = startDate ? startOfDay(startDate) : subDays(now, 7);
    const end = endDate ? endOfDay(endDate) : now;

        const occupancyReport = await this.prisma.hospitalization.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        wardPlace: {
          Ward: {
            departmentId: departmentId,
          },
        },
      },
      include: {
        doctor:{
          select:{
            firstName: true,
            lastName: true
          }
        },
        patient:{
          select:{
            firstName: true,
            lastName: true
          }
        },
        wardPlace: {
          select: {
            placeNumber: true,
            Ward: {
              select: { number: true },
            },
          },
        },
      },
    });
    console.log(occupancyReport)
    return occupancyReport;
  }
  async getHospitalizationsReportSortedByDepartment() {
    const hospitalizationsReport = await this.prisma.hospitalization.findMany({
      select: {
        id: true,
        createdAt: true,
        dischargeDate: true,
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true } },
        wardPlace: {
          select: {
            placeNumber: true,
            isFree: true,
            Ward: {
              select: {
                number: true,
                Department: { select: { name: true } },
              },
            },
          },
        },
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });

    hospitalizationsReport.sort((a, b) => {
      const depA = a.wardPlace?.Ward?.Department?.name ?? '';
      const depB = b.wardPlace?.Ward?.Department?.name ?? '';
      return depA.localeCompare(depB);
    });

    return hospitalizationsReport;
  }
}

