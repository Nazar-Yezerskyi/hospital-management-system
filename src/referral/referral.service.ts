import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { nanoid } from 'nanoid';
import { PositionService } from 'src/position/position.service';
import { PositionEnum } from 'src/enums/position.enum';

@Injectable()
export class ReferralService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private positionService: PositionService
  ){}

  async findByCode(code: string) {
    const find = await this.prisma.referral.findFirst({
      where: {
        code: {
          equals: code,
          mode: 'insensitive',
        },
      },
    });
    return find;
  }


  async findById(id:number){
    const find = await this.prisma.referral.findUnique({
      where:{
        id
      }
    })
    return find
  }


  private async generateUniqueCode() {
    let code: string;
    let exists = true;

    do {
      code = nanoid(10); 
      const existing = await this.prisma.referral.findUnique({ where: { code } });
      exists = !!existing;
    } while (exists);

    return code;
  }

  async createReferral(patientId: number, doctorId: number, position: string){
    const findPatient = await this.userService.findPatientById(patientId)
    if(!findPatient){
      throw new NotFoundException("Patient not found")
    }
    const findDoctor = await this.userService.findUserById(doctorId)
    if(findDoctor.StaffDetails.Position.position !== PositionEnum.DOCTOR){
      throw new  ForbiddenException("User is not a doctor")
    }
    const findPosition = await this.positionService.findBySpecialization(position)
    if(!findPosition){
      throw new NotFoundException("Specialization not found")
    }

    const generateUniqueCode = await this.generateUniqueCode()
    const createReferral = await this.prisma.referral.create({
      data:{
        patientId,
        creatorId: doctorId,
        positionId:findPosition.id,
        code: generateUniqueCode
      }
    })
    return createReferral
  }

  async updateReferral(doctorId: number, position: string, referralId:number){
    const findReferral = await this.findById(referralId)
    if(!findReferral){
      throw new NotFoundException("Referral not found")
    }
    const findDoctor = await this.userService.findUserById(doctorId)
    if(findDoctor.StaffDetails.Position.position !== PositionEnum.DOCTOR){
      throw new  ForbiddenException("User is not a doctor")
    }
    if(findDoctor.id !== findReferral.creatorId){
      throw new ForbiddenException("You cannot update this referral")
    }
    const findPosition = await this.positionService.findBySpecialization(position)
    if(!findPosition){
      throw new NotFoundException("Specialization not found")
    }
    const createReferral = await this.prisma.referral.update({
      where:{
        id:findReferral.id
      },
      data:{
        positionId:findPosition.id,
      }
    })
    return createReferral
  }

  async deleteReferral(doctorId: number,referralId:number){
    const findReferral = await this.findById(referralId)
    if(!findReferral){
      throw new NotFoundException("Referral not found")
    }
    const findDoctor = await this.userService.findUserById(doctorId)
    if(findDoctor.StaffDetails.Position.position !== PositionEnum.DOCTOR){
      throw new  ForbiddenException("User is not a doctor")
    }
    if(findDoctor.id !== findReferral.creatorId){
      throw new ForbiddenException("You cannot delete this referral")
    }
    const deleteReferral = await this.prisma.referral.update({
      where:{
        id:findReferral.id
      },
      data:{
        isActive: false
      }
    })
    return deleteReferral
  }

    async findByCodeAndUser(code: string, patientId: number) {
    const find = await this.prisma.referral.findFirst({
      where: {
        patientId,
        code: {
          equals: code,
          mode: 'insensitive',
        },
      },
    });
    return find
  }

  async findReferralByUser(userId: number){
    const find = await this.prisma.referral.findMany({
      where:{
        patientId: userId,
        isActive: true
      },
      include:{
        position:{
          select: {
            specialty:true,
          }
        }
      }
    })
    return find
  }

}
