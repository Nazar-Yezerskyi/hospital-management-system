import { Body, Controller, Post, Patch, Param, Request, UseGuards, Get, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dtos/update-appointment';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetAvailableSlotsDto } from './dtos/get-available-slots.dto';
import { IsDoctorGuard } from 'src/guards/is-doctor.guard';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService){}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    const {
      doctorId,
      date,
      time,
      serviceId,
      referralCode,
      paymentMethod,
      successUrl
    } = createAppointmentDto;
    const userId = req.user.userId
    return await this.appointmentService.createAppointment(
      userId,
      doctorId,
      date,
      time,
      serviceId,
      paymentMethod,
      referralCode,
      successUrl
    );
  }

  @Post('/byAdmin/:patientId')
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async createByAdmin(@Body() createAppointmentDto: CreateAppointmentDto, @Param('patientId') patientId :string ) {
    const {
      doctorId,
      date,
      time,
      serviceId,
      referralCode,
      paymentMethod
    } = createAppointmentDto;
    const userId = +patientId
    return await this.appointmentService.createAppointment(
      userId,
      doctorId,
      date,
      time,
      serviceId,
      paymentMethod,
      referralCode
    );
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
    @Request() req
  ) {
    const userId = req.user.userId
    return await this.appointmentService.updateStatus(+id, updateStatusDto.status,userId);
  }

   @Get('available-slots')
    async getAvailableSlots(@Query() query: GetAvailableSlotsDto) {
      const { doctorId, date } = query;
      const availableSlots = await this.appointmentService.getAvailableTimeSlots(+doctorId, date);
      return { availableSlots };
    }

  @Get('appointmennt-by-patient')
  @UseGuards(JwtAuthGuard)
  async getAppointmentByPatient(@Request() req){
    const userId = req.user.userId
    const getAppoinment = await this.appointmentService.findAppointmentByUser(userId)
    return getAppoinment
  }
  @Get("/all")
  async getAllAppo(){
    const find = await this.appointmentService.findAllAppoFoToday()
    return find
  }
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelAppointment(
    @Param('id') appointmentId: string,
    @Request() req
  ) {
    const userId = req.user.userId;
    return this.appointmentService.cancelAppointment(userId, +appointmentId);
  }

  @Get('completed')
  @UseGuards(JwtAuthGuard)
  async getCompletedAppointments(
    @Request() req
  ) {
    const userId = req.user.userId;
    return this.appointmentService.showAllCompletedAppointments(userId);
  }

  @Get('appointment-info')
  @UseGuards(IsDoctorGuard)
  async findAppointmentByDoctor(@Request() req){
    const doctorId = req.user.userId
    const find = await this.appointmentService.findAppointmentByDoctor(doctorId)
    return find
  }
}
