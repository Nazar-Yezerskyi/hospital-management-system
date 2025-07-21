import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { StaffDetailsService } from './staff-details.service';
import { UpdateStaffDetailsDto } from './dtos/update-staff-details.dto';
import { AddStaffDetailsDto } from './dtos/add-staff-details.dto';
import { IsStaffGuard } from 'src/guards/is-staff.guard';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';

@Controller('staff-details')
export class StaffDetailsController {
  constructor(
    private staffDetailsService: StaffDetailsService
  ){}

  @Get(":id")
  @UseGuards(IsStaffGuard)
  async findStaffDetailsByUser(@Param("id") id: string){
    const find = await this.staffDetailsService.findStaffDetailsByUser(+id)
    return find
  }

  @Post(":positionId")
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async addStaffDetails(@Param("positionId") positionId: string, @Body() data: AddStaffDetailsDto){
    const addStaffDetails = await this.staffDetailsService.addStaffDetails(data,+positionId)
    return addStaffDetails
  }

  @Put(":userId")
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async updateStaffDetails(@Body() data: UpdateStaffDetailsDto, @Param('userId') userId: string){
    const update = await this.staffDetailsService.updateStaffDetails(data, +userId)
    return update
  }

  @Post("/fired/:userId")
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async deleteStaffDetailsFiredStaff(@Param("userId") userId: string ){
    const fired = await this.staffDetailsService.deleteStaffDetailsFiredStaff(+userId)
    return fired
  }
  @Get('/report/:departmetnId')
  async getReport(@Param('departmetnId') departmetnId: string){
    const report = await this.staffDetailsService.getStaffReport(+departmetnId)
    return report
  }

  
}
