import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SheduleSlotService } from 'src/shedule-slot/shedule-slot.service';
import { UserService } from 'src/user/user.service';
import { FindWorkSheduleDto } from './dtos/find-work-shedule.dto';

@Injectable()
export class WorkSheduleService {
  constructor(
    private prisma: PrismaService,
    private sheduleSlotService: SheduleSlotService,
    private userService: UserService
  ) {}

  private async getOrCreateSlot(startTime: string, endTime: string, dayOfWeek: string) {
    const slot = await this.sheduleSlotService.findSlot({ startTime, endTime, dayOfWeek });
    return slot ?? await this.sheduleSlotService.createSlot({ startTime, endTime, dayOfWeek });
  }

  private async getStaffDetailsId(userId: number){
    const user = await this.userService.findUserById(userId);
    if (!user?.StaffDetails) {
      throw new ForbiddenException('This user is not a staff member');
    }
    return user.StaffDetails.id;
  }

  private async findWorkSheduleRecord(staffDetailsId: number, sheduleSlotId: number) {
    return this.prisma.workShedule.findFirst({
      where: { 
        staffDetailsId, 
        sheduleSlotId 
      },
    });
  }

  private async createRecord(staffDetailsId: number, sheduleSlotId: number) {
    return this.prisma.workShedule.create({
      data: { 
        staffDetailsId, 
        sheduleSlotId 
      },
    });
  }

  async addWorkSheduleRecord(workSheduleData: FindWorkSheduleDto) {
    const { startTime, endTime, dayOfWeek, userId } = workSheduleData;

    const staffDetailsId = await this.getStaffDetailsId(userId);
    const slot = await this.getOrCreateSlot(startTime, endTime, dayOfWeek);

    const existingRecord = await this.findWorkSheduleRecord(staffDetailsId, slot.id);
    if (existingRecord) {
      throw new ForbiddenException('Record already exists');
    }

    return this.createRecord(staffDetailsId, slot.id);
  }

  async deleteRecord(staffDetailsId: number, sheduleSlotId: number){
    const findRecord = await this.findWorkSheduleRecord(staffDetailsId,sheduleSlotId)
    if(!findRecord){
      throw new NotFoundException('Record not found')
    }
    const deleteRecord = await this.prisma.workShedule.delete({
      where:{
        id: findRecord.id
      }
    })
    return deleteRecord
  }

  async findWorkSheduleForStaff(userId: number){
    const findUser  = await this.userService.findUserById(userId)
    if(!findUser.StaffDetails.id){
      throw new ForbiddenException("User is not a staff")
    }
    const workShedule = await this.prisma.workShedule.findMany({
      where:{
        staffDetailsId: findUser.StaffDetails.id
      },
      include:{
        sheduleSlot: true
      }
    })
    return workShedule
  }
}
