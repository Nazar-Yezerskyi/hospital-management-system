import { Body, Controller, Post, UseGuards, Request, Put, Param, Get } from '@nestjs/common';
import { AppointmentNotesService } from './appointment-notes.service';
import { IsDoctorGuard } from 'src/guards/is-doctor.guard';
import { CreateNotesDto } from './dtos/create-notes.dto';
import { UpdateNotesDto } from './dtos/update-notes.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('appointment-notes')
export class AppointmentNotesController {
  constructor(private appointmentNotesService: AppointmentNotesService){}

  @Post()
  @UseGuards(IsDoctorGuard)
  async createNotes(@Body() data: CreateNotesDto, @Request() req){
    const doctorId = req.user.userId
    const createNotes = await this.appointmentNotesService.createNotes(data,doctorId)
    return createNotes
  }

  @Put('/:appointmentId')
  @UseGuards(IsDoctorGuard)
  async updateNotes(@Body() data: UpdateNotesDto,@Param("appointmentId") appointmentId: string, @Request() req){
    const doctorId = req.user.userId
    const update = await this.appointmentNotesService.updateNotes(data,+appointmentId,doctorId)
    return update
  }

  @Get('/findByUser')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Request() req){
    const userId = req.user.userId
    const find = await this.appointmentNotesService.findByUser(userId)
    return find
  }
}
