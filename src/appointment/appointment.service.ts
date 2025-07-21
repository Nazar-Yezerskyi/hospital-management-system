import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentStatus } from 'src/enums/appointment-status.enum';
import { PositionEnum } from 'src/enums/position.enum';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReferralService } from 'src/referral/referral.service';
import { ServiceService } from 'src/service/service.service';
import { UserService } from 'src/user/user.service';
import { getDayShortName, isDayIncluded } from 'src/utils/date.utils';
import { WorkSheduleService } from 'src/work-shedule/work-shedule.service';
import { startOfDay, endOfDay } from 'date-fns';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AppointmentService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private workSheduleService: WorkSheduleService,
    private serviceService: ServiceService,
    private referralService: ReferralService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    private mailerService:MailerService
  ){}

  async findAppointmentById(id: number){
    const find = await this.prisma.appointment.findUnique({
      where:{
        id
      },
      include:{
        doctor:  true,
        patient : true,
        service: true
      }
    })
    return find
  }
  async findAppointment(patientId: number, doctorId: number, date: string, time: string) {
    const isoDateTimeString = `${date}T${time}:00.000Z`;
    const dateTime = new Date(isoDateTimeString);
  
    if (isNaN(dateTime.getTime())) {
      throw new BadRequestException("Invalid date or time format");
    }
  
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        patientId,
        doctorId,
        dateAndtime: dateTime,
        status: AppointmentStatus.PENDING,
      },
    });
  
    return appointment;
  }
  private async isDoctorAvailable(doctorId: number, startTime: Date, endTime: Date): Promise<boolean> {
    const conflictingAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        dateAndtime: {
          lt: endTime,
          gte: startTime,
        },
        status:{
          notIn :['canceled']
        }
      },
    });
  
    return conflictingAppointments.length === 0;
  }
  
  async createAppointment(
    patientId: number,
    doctorId: number,
    date: string,
    time: string,
    serviceId: number,
    paymentMethod: string,
    referralCode?: string,
    successUrl?: string
  ) {
    console.log(patientId)
    const findUser = await this.userService.findUserById(patientId);
    if (!findUser) {
      throw new NotFoundException("User not found");
    }
    const findDoctor = await this.userService.findUserById(doctorId);
    if (  findDoctor.StaffDetails.Position.position !== PositionEnum.DOCTOR &&
    findDoctor.StaffDetails.Position.position !== PositionEnum.HEAD_OF_DEPARTMENT) {
      throw new ForbiddenException("This user is not a doctor");
    }
    const findAppointment = await this.findAppointment(patientId, doctorId, date, time);
    if (findAppointment) {
      throw new ForbiddenException("Appointment already exists");
    }
    const doctorSchedule = await this.workSheduleService.findWorkSheduleForStaff(findDoctor.id);
    if (!doctorSchedule) {
      throw new ForbiddenException("It is impossible to make an appointment");
    }
    const findService = await this.serviceService.findById(serviceId);
    if (!findService) {
      throw new NotFoundException("Service not found");
    }
    if (findService.position.specialty !== findDoctor.StaffDetails.Position.specialty) {
      throw new BadRequestException("Selected service does not match the doctor's specialization");
    }

    let findReferral;
    if (referralCode) {
      findReferral = await this.referralService.findByCode(referralCode);
      if (!findReferral) {
        throw new NotFoundException("Referral not found");
      }
      if (findReferral.positionId !== findDoctor.StaffDetails.Position.id) {
        throw new BadRequestException("Selected referral does not match the doctor's specialization");
      }
    }
  
    const dayName = getDayShortName(date);
    const validSlot = doctorSchedule.find(slot =>
      isDayIncluded(slot.sheduleSlot.dayOfWeek, dayName) &&
      time >= slot.sheduleSlot.startTime &&
      time < slot.sheduleSlot.endTime
    );
  
    if (!validSlot) {
      throw new ForbiddenException("The doctor is not available at the selected time");
    }
  
    const appointmentDurationMinutes = findDoctor.StaffDetails.appointmentDurationMinutes || 30;
    const dateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(dateTime.getTime() + appointmentDurationMinutes * 60000);
  
    const endOfWorkDay = new Date(`${date}T${validSlot.sheduleSlot.endTime}:00`);
    const slotStartDateTime = new Date(`${date}T${validSlot.sheduleSlot.startTime}:00`);
    const diffMinutes = (dateTime.getTime() - slotStartDateTime.getTime()) / 60000;
  
    if (diffMinutes % appointmentDurationMinutes !== 0) {
      throw new ForbiddenException(`You can only book at ${appointmentDurationMinutes}-minute intervals starting from ${validSlot.sheduleSlot.startTime}`);
    }
  
    if (endDateTime > endOfWorkDay) {
      throw new ForbiddenException("The selected time exceeds the doctor's available working hours");
    }
  
    const isAvailable = await this.isDoctorAvailable(doctorId, dateTime, endDateTime);
    if (!isAvailable) {
      throw new ForbiddenException("The doctor already has an appointment during this time");
    }
  
    const createdAppointment = await this.prisma.appointment.create({
      data: {
        dateAndtime: dateTime,
        patientId,
        doctorId,
        serviceId,
        referralId: referralCode ? findReferral.id : null,
      }
    });
    const payment = await this.paymentService.createPaymentIntent(findService.price,createdAppointment.id,paymentMethod, successUrl)
    console.log(payment)
    return {
      createdAppointment,
    checkoutUrl: payment};
  }
  
  async updateStatus(appointmentId:number, status: AppointmentStatus, userId: number){
    const findAppointment = await this.findAppointmentById(appointmentId)
    if(!findAppointment){
      throw new NotFoundException("Appointment not found")
    }
    const findUser = await this.userService.findUserById(userId)
    if (findUser.id !== findAppointment.doctorId && findUser.id !== findAppointment.patientId) {
      throw new ForbiddenException('You do not have permission to access this appointment');
    }
    
    const updateStatus = await this.prisma.appointment.update({
      where:{
        id: appointmentId
      },
      data:{
        status
      }
    })
    return updateStatus
  }
  async getAvailableTimeSlots(doctorId: number, date: string) {
  const doctor = await this.userService.findUserById(doctorId);
  if (!doctor || (doctor.StaffDetails.Position.position !== PositionEnum.DOCTOR &&
   doctor.StaffDetails.Position.position !== PositionEnum.HEAD_OF_DEPARTMENT)) {
    throw new NotFoundException('Doctor not found');
  }

  const schedule = await this.workSheduleService.findWorkSheduleForStaff(doctorId);
  if (!schedule || schedule.length === 0) {
    throw new ForbiddenException('Doctor has no schedule');
  }

  const dayName = getDayShortName(date);
  const workingSlots = schedule.filter(slot =>
    isDayIncluded(slot.sheduleSlot.dayOfWeek, dayName)
  );

  if (workingSlots.length === 0) {
    return [];
  }

  const appointmentDuration = doctor.StaffDetails.appointmentDurationMinutes || 30;

  const takenAppointments = await this.prisma.appointment.findMany({
    where: {
      doctorId,
      dateAndtime: {
        gte: new Date(`${date}T00:00:00`),
        lt: new Date(`${date}T23:59:59`)
      },
      status: {
        in: [AppointmentStatus.PENDING, AppointmentStatus.COMPLETED]
      }
    }
  });

  const takenTimes = takenAppointments.map(a => {
    const local = new Date(a.dateAndtime);
    const hours = local.getHours().toString().padStart(2, '0');
    const minutes = local.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const availableTimes: string[] = [];

  const now = new Date();
  const isToday = date === now.toISOString().split('T')[0];

  for (const slot of workingSlots) {
    const start = slot.sheduleSlot.startTime;
    const end = slot.sheduleSlot.endTime;

    let current = new Date(`${date}T${start}:00`);
    const endDate = new Date(`${date}T${end}:00`);

    while (current.getTime() + appointmentDuration * 60000 <= endDate.getTime()) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      if (isToday && current <= now) {
        current = new Date(current.getTime() + appointmentDuration * 60000);
        continue;
      }

      if (!takenTimes.includes(timeStr)) {
        availableTimes.push(timeStr);
      }

      current = new Date(current.getTime() + appointmentDuration * 60000);
    }
  }

  return availableTimes;
}


  async findAppointmentByUser(userId: number) {
    const now = new Date();
    const find = await this.prisma.appointment.findMany({
      where: {
        patientId: userId,
        status: AppointmentStatus.PENDING,
        dateAndtime: {
          gte: now
        }
      },
      orderBy: {
        dateAndtime: 'asc'
      },
      include:{
        Payment:{
          select:{
            paymentMethod: true
          }
        },
        service:{
          select:{
            price: true,
            name: true
          }
        },
        doctor:{
          include:{
            StaffDetails:{
              select:{
                officeNumber: true
              }
            }
          }
        }
      }
    });
    return find;
  }
  async cancelAppointment(userId: number, appointmentId: number){
    const findAppointment = await this.findAppointmentById(appointmentId)
    if(!findAppointment){
      throw new NotFoundException('Appointment not found')
    }
    if (findAppointment.patientId !== userId && findAppointment.doctorId !== userId) {
      throw new ForbiddenException('You cannot cancel this appointment');
    }
    
    const cancelAppointment = await this.prisma.appointment.update({
      where:{
        id: appointmentId,
      },
      data:{
        status: AppointmentStatus.CANCELED
      }
    })
    if (findAppointment.doctorId === userId) {
    // Надсилання листа пацієнту
    await this.mailerService.sendMail({
      to: findAppointment.patient.email,
      subject: 'Appointment Cancelled by Your Doctor',
      text: `Dear ${findAppointment.patient.firstName},

        We would like to inform you that your appointment scheduled on ${new Date(findAppointment.dateAndtime).toLocaleDateString()} has been cancelled by your doctor.

        Please contact the hospital or rebook your appointment through our system if needed.

        Best regards,
        Your Hospital Team`,
            });
          }

    return cancelAppointment
  }
  async showAllCompletedAppointments(userId: number){
    const find = await this.prisma.appointment.findMany({
      where:{
        status: 'completed',
        patientId: userId
      },
      orderBy: {
      createdAt: 'desc' 
    },
      include:{
        AppointmentNotes: true,
        Hospitalization: true,
        doctor:{
          include:{
            StaffDetails:{
              include:{
                Position:{
                  select: {
                    specialty: true
                  }
                }
              }
            }
          }
        }
      }
    })
    return find
  }
async findAppointmentByDoctor(doctorId: number, date?: string) {
  const selectedDate = date ? new Date(date) : new Date();

  const start = startOfDay(selectedDate); 
  const end = endOfDay(selectedDate);   

  const find = await this.prisma.appointment.findMany({
    where: {
      doctorId,
      dateAndtime: {
        gte: start,
        lte: end,
      },
    },
    include: {
      patient: true,
    },
    orderBy: {
      dateAndtime: 'asc',
    },
  });

  return find;
}
  async findAllAppoFoToday(){
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // 00:00:00.000

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); 
    const find = await this.prisma.appointment.findMany({
      where:{
        dateAndtime: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy:{
        dateAndtime: 'asc'
      },
      include:{
        Payment:{
          select:{
            status: true,
            paymentMethod: true
          }
        },
        doctor:{
          select:{
            firstName: true,
            lastName: true,
            StaffDetails:{
              select:{
                officeNumber: true
              }
            }
          }
        },
        patient:{
          select:{
            firstName: true,
            lastName: true,
            phoneNumber:true
          }
        },
        service: true
      }
    })
    return find 
  }
}