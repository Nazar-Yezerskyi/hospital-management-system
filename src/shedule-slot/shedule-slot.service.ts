import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSheduleSlotDto } from './dtos/create-shedule-slot.dto';
import { FindSheduleSlotDto } from './dtos/find-schedule-slot.dto';

@Injectable()
export class SheduleSlotService {
  constructor(private prisma: PrismaService){}

  async findSlot(slotData: FindSheduleSlotDto) {
    const { dayOfWeek, startTime, endTime } = slotData;
  
    const find = await this.prisma.sheduleSlot.findFirst({
      where: {
        dayOfWeek,
        startTime,
        endTime,
      },
    });
  
    return find;
  }
  
  async createSlot(slotData: CreateSheduleSlotDto){
    const existingSlot = await this.findSlot(slotData);
    if (existingSlot) {
      throw new BadRequestException('A slot with the same parameters already exists.');
    }
    const createSlot = await this.prisma.sheduleSlot.create({
      data:{
        ...slotData
      }
    })
    return createSlot
  }

  // delete????
}
