import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { HospitalizationService } from './hospitalization.service';
import { IsDoctorGuard } from 'src/guards/is-doctor.guard';
import { AddHospitalizationDto } from './dtos/add-hospitalization.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('hospitalization')
export class HospitalizationController {
  constructor(private hospitalizationService: HospitalizationService){}

  @Post()
  @UseGuards(IsDoctorGuard)
  async addHospitalization(@Body() data:AddHospitalizationDto, @Request()req ){
    const doctorId = req.user.userId
    const addHospitalization = await this.hospitalizationService.addHospitalization(data, doctorId)
    return addHospitalization
  }

  @Put("/:hospitalizationId")
  @UseGuards(IsDoctorGuard)
  async dischargeThePatient(@Param("hospitalizationId") hospitalizationId: string,@Request() req ){
    const doctorId = req.user.userId
    const dischargeThePatient = await this.hospitalizationService.dischargeThePatient(+hospitalizationId,doctorId)
    return dischargeThePatient
  }

  @Get('/find')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Request() req){
    const userId = req.user.userId
    const find = await this.hospitalizationService.findHospitalizationByUser(userId)
    return find
  }
  @Get('/findByDoctor')
  @UseGuards(IsDoctorGuard)
  async findByDoctor(@Request() req){
    const doctorId = req.user.userId
    const find = await this.hospitalizationService.findHospitalizationByDoctor(doctorId)
    return find
  }
  @Get('/report/Byadmin')
  async getReport() {
    const report = await this.hospitalizationService.getHospitalizationsReportSortedByDepartment();
    return report;
  }
  @Get('report/:departmentId')
  async getOccupancyReport(
    @Param('departmentId') departmentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    return this.hospitalizationService.getOccupancyReport(
      +departmentId,
      parsedStartDate,
      parsedEndDate,
    );
  }

}
