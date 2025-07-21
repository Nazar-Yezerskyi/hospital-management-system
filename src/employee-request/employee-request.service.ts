import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AddRequestDto } from './dtos/add-request.dto';
import { RequestStatus } from 'src/enums/request-status.enum';
import { PositionEnum } from 'src/enums/position.enum';

@Injectable()
export class EmployeeRequestService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ){}
  async findById(id:number){
    const find = await this.prisma.employeeRequest.findUnique({
      where:{
        id
      }
    })
    return find
  }
async addRequest(requestData: AddRequestDto){
  const findUser = await this.userService.findUserById(requestData.userId);
  if(!findUser.StaffDetails){
    throw new ForbiddenException("This user is not a staff");
  }

  // Створюємо копію requestData без поля userId
  const { userId, ...dataWithoutUserId } = requestData;

  const addRequest = await this.prisma.employeeRequest.create({
    data: {
      ...dataWithoutUserId,
      startDate: dataWithoutUserId.startDate ? new Date(dataWithoutUserId.startDate) : null,
      endDate: dataWithoutUserId.endDate ? new Date(dataWithoutUserId.endDate) : null,
      createdById: findUser.id
    }
  });

  return addRequest;
}

  async deleteRequest(requestId: number, userId: number){
    const findRequest = await this.findById(requestId)
    if(!findRequest){
      throw new NotFoundException("Record not found")
    }
    if(findRequest.createdById !== userId){
      throw new ForbiddenException("You are not allowed to access this record");
    }
    if(findRequest.status !== RequestStatus.PENDING){
      throw new BadRequestException("Only pending requests can be deleted");
    }
    const deletedRequest = await this.prisma.employeeRequest.update({
      where:{
        id: findRequest.id
      },
      data:{
        status: RequestStatus.CANCELED
      }
    })
    return deletedRequest
  }
  async changeStatus(recordId:number, userId: number, status: RequestStatus){
    const changeStatus = await this.prisma.employeeRequest.update({
      where:{
        id:recordId
      },
      data:{
        approvedById:userId,
        status
      }
    })
    return changeStatus
  }
  async rejectOrApproveRequest(recordId: number, userId: number, status: string) {
    const findRecord = await this.findById(recordId);
    if (!findRecord) {
      throw new NotFoundException("Record not found");
    }
  
    const findUser = await this.userService.findUserById(userId);
    if (
      findUser.StaffDetails.Position.position !== PositionEnum.ADMIN &&
      findUser.StaffDetails.Position.position !== PositionEnum.CHIEF_MEDICAL_OFFICER &&
      findUser.StaffDetails.Position.position !== PositionEnum.HEAD_OF_DEPARTMENT
    ) {
      throw new ForbiddenException("You do not have permission to perform this action");
    }
  
    if (!Object.values(RequestStatus).includes(status as RequestStatus)) {
      throw new BadRequestException("Invalid status");
    }
  
    const updatedRecord = await this.changeStatus(recordId, userId, status as RequestStatus);
    return updatedRecord;
  }
  
  async showRequests(userId: number){
    const find = await this.prisma.employeeRequest.findMany({
      where:{
        createdById: userId
      },
      orderBy: {
        createdAt: 'desc'
      },

      include:{
        approvedBy: {
          select:{
            firstName: true,
            lastName: true
          }
        }
      }
    })
    return find
  }
  async showPendingRequests(){
    const find = await this.prisma.employeeRequest.findMany({
      where:{
        status: 'pending'
      },
      include:{
        createdBy:{
          include:{
            StaffDetails:{
              include:{
                Position: true,
                Department: true
              }
          
            },
      
          }
        }
      }
    })
    return find
  }
}
