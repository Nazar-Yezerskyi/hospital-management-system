import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WorkSheduleService } from './work-shedule.service';
import { FindWorkSheduleDto } from './dtos/find-work-shedule.dto';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';

@Controller('work-shedule')
@UseGuards(IsAdminOrChiefDoctorGuard)
export class WorkSheduleController {
  constructor(
    private workSheduleService: WorkSheduleService
  ){}

  @Post()
  async addWorkSheduleRecord(@Body() data: FindWorkSheduleDto){
    const addWorkSheduleRecord = await this.workSheduleService.addWorkSheduleRecord(data)
    return addWorkSheduleRecord
  }

  @Delete(":staffDetailId/:slotId")
  async deleteRecord(@Param("staffDetailId") staffDetailId :string, @Param("slotId") slotId: string){
    const deleteRecord = await this.workSheduleService.deleteRecord(+staffDetailId,+slotId) 
    return deleteRecord
  }

  @Get(":userId")
  async findWorkSheduleForStaff(@Param("userId") userId: string){
    const find = await this.workSheduleService.findWorkSheduleForStaff(+userId)
    return find
  }

}
