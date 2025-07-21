import { Body, Controller, Param, Post, Put, Query, Request, UseGuards, Get } from '@nestjs/common';
import { EmployeeRequestService } from './employee-request.service';
import { IsStaffGuard } from 'src/guards/is-staff.guard';
import { AddRequestDto } from './dtos/add-request.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { IsAdminChiefOrHeadGuard } from 'src/guards/is-admin-chief-or-head.guard';

@Controller('employee-request')
export class EmployeeRequestController {
  constructor( private employeeRequestService: EmployeeRequestService){}

  @Post()
  async addRequest(@Body()data: AddRequestDto ){

    const addRequest= await this.employeeRequestService.addRequest(data)
    return addRequest
  }
  @Get('/pending')
  async showPendingRequests(){
    const find = await this.employeeRequestService.showPendingRequests()
    return find
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async showRequest(@Request() req){
    const userId = req.user.userId
    const show = await this.employeeRequestService.showRequests(userId)
    return show
  }
  @Put('delete-request/:requestId')
  @UseGuards(IsStaffGuard)
  async deleteRequest(@Param("requestId")requestId: string, @Request() req){
    const userId = req.user.userId
    const deletedRequest = await this.employeeRequestService.deleteRequest(+requestId,userId)
    return deletedRequest
  }

  @Put('approve-or-reject/:requestId')
  @UseGuards(IsAdminChiefOrHeadGuard)
  async rejectOrApproveRequest(@Param("requestId")requestId: string, @Request() req, @Query('status') status: string){
    const userId = req.user.userId
    const rejectOrApproveRequest = await this.employeeRequestService.rejectOrApproveRequest(+requestId,userId, status)
    return rejectOrApproveRequest
  }

}
