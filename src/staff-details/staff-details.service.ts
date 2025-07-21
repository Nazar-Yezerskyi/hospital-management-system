import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AddStaffDetailsDto } from './dtos/add-staff-details.dto';
import { RoleEnum } from 'src/enums/role.emun';
import { PositionService } from 'src/position/position.service';
import { UpdateStaffDetailsDto } from './dtos/update-staff-details.dto';

@Injectable()
export class StaffDetailsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private positionService: PositionService
  ){}

  async findStaffDetailsByUser(userId: number){
    const findUser = await this.userService.findUserById(userId)
    if(findUser.Role.id === RoleEnum.USER){
      throw new ForbiddenException('This user is not a staff member')
    }
    const find = await this.prisma.staffDetails.findUnique({
      where:{
        userId
      },
      include:{
        Position: true
      }
    })
    return find
  }

  async addStaffDetails(staffDetails: AddStaffDetailsDto, positionId: number){
    const findUser = await this.userService.findUserById(staffDetails.userId)
    if(findUser.Role.id === RoleEnum.USER){
      throw new ForbiddenException('This user is not a staff member')
    }
    if(findUser.StaffDetails){
      throw new BadRequestException(`There is already information about the user with id ${findUser.id}, you can only esit it`)
    }
    const findPosition = await this.positionService.findById(positionId)
    if(!findPosition){
      throw new NotFoundException('Position not found')
    }
    const addStaffDetails = await this.prisma.staffDetails.create({
      data:{
        ...staffDetails,
        hireDate:  new Date(staffDetails.hireDate).toISOString(),
        positionId
      }
    })
    return addStaffDetails
  }

  async updateStaffDetails(staffDetails: UpdateStaffDetailsDto, userId:number){
    const findUser = await this.userService.findUserById(userId)
    if(findUser.Role.id === RoleEnum.USER){
      throw new ForbiddenException('This user is not a staff member')
    }
    if(!findUser.StaffDetails){
      throw new BadRequestException(`User not  a staff`)
    }
    const findPosition = await this.positionService.findById(staffDetails.positionId)
    if(!findPosition){
      throw new NotFoundException('Position not found')
    }
    const updateStaffDetails = await this.prisma.staffDetails.update({
      where:{
        id: findUser.StaffDetails.id
      },
      data:{
        ...staffDetails
      }
    })
    return updateStaffDetails;
  }
  async deleteStaffDetailsFiredStaff(userId: number){
    const findUser = await this.userService.findUserById(userId)
    if(findUser.Role.id === RoleEnum.USER){
      throw new ForbiddenException('This user is not a staff member')
    }
    if(!findUser.StaffDetails){
      throw new NotFoundException(`Staff details not found`)
    }
    const deleteStaffDetailsFiredStaff = await this.prisma.staffDetails.update({
      where:{
        id: findUser.StaffDetails.id
      },
      data:{
        firedDate: new Date()
      }
    })
    return deleteStaffDetailsFiredStaff
  }
async getStaffReport(departmentId: number) {
    const staffReport = await this.prisma.staffDetails.findMany({
      where: { departmentId },
      select: {
        hireDate: true,
        firedDate: true,
        salaryMultiplier: true,
        Position: {
          select: {
            position: true,
            baseSalary: true,
          },
        },
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        workSchedules: {
          select: {
            sheduleSlot:true
            }
        }
      },
    });
    return staffReport;
  }
}
