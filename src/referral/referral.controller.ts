import { Controller, Param, Post, UseGuards, Request, Put, Get, NotFoundException, Query } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { IsDoctorGuard } from 'src/guards/is-doctor.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService){}

  @Post('/:userId/:position')
  @UseGuards(IsDoctorGuard)
  async createReferral(@Param("userId") userId: string, @Param("position") position: string, @Request() req){
    const doctorId = req.user.userId
    const createReferral = await this.referralService.createReferral(+userId,doctorId,position)
    return createReferral
  }

  @Put('/:recordId/:position')
  @UseGuards(IsDoctorGuard)
  async updateReferral(@Param("recordId") recordId: string, @Param("position") position: string, @Request() req){
    const doctorId = req.user.userId
    const update = await this.referralService.updateReferral(doctorId,position,+recordId)
    return update
  }

  @Put("/delete/:recordId")
  @UseGuards(IsDoctorGuard)
  async deleteReferral(@Param("recordId") recordId: string, @Request() req){
    const doctorId = req.user.userId
    const deleteReferral = await this.referralService.deleteReferral(doctorId,+recordId)
    return deleteReferral
  }
  @Get('by-code-and-user')
  async getReferralByCodeAndUser(
    @Query('code') code: string,
    @Query('patientId') patientId: string,
  ) {
    const referral = await this.referralService.findByCodeAndUser(code, +patientId);

    if (!referral) {
      throw new NotFoundException('Referral not found for this patient');
    }

    return referral;
  }

  @Get('byUser')
  @UseGuards(JwtAuthGuard)
  async findReferralByUser(@Request() req){
    const userId = req.user.userId
    const find = await this.referralService.findReferralByUser(userId)
    return find
  }
}
