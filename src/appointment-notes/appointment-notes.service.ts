import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentService } from 'src/appointment/appointment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { PositionEnum } from 'src/enums/position.enum';
import { CreateNotesDto } from './dtos/create-notes.dto';
import { UpdateNotesDto } from './dtos/update-notes.dto';
import { AppointmentStatus } from 'src/enums/appointment-status.enum';


@Injectable()
export class AppointmentNotesService {
  constructor(
    private prisma: PrismaService,
    private appointmentService: AppointmentService,
    private userService: UserService
  ){}

  async findByAppointmentId(appointmentId: number){
    const find = await this.prisma.appointmentNotes.findUnique({
      where:{
        appointmentId
      }
    })
    return find
  }
  async createNotes(data:CreateNotesDto, doctorId: number ){
    const findUser = await this.userService.findUserById(doctorId)
    if(findUser.StaffDetails.Position.position !== PositionEnum.DOCTOR){
      throw new ForbiddenException("User is not a doctor")
    }
    const findAppointment = await this.appointmentService.findAppointmentById(data.appointmentId)
    if(!findAppointment){
      throw new NotFoundException("Appointment not found")
    }
    const findAppointmentNotes = await this.findByAppointmentId(data.appointmentId)
    if(findAppointmentNotes){
      throw new BadRequestException("Record already exists")
    }
    const createNotes = await this.prisma.appointmentNotes.create({
      data:{
        ...data
      }
    })
    await this.appointmentService.updateStatus(data.appointmentId, AppointmentStatus.COMPLETED,doctorId)
    return createNotes
  }

  async updateNotes(updatedata: UpdateNotesDto, appointmentId: number, doctorId:number){
    const findAppointment = await this.appointmentService.findAppointmentById(appointmentId)
    if(findAppointment.doctorId !== doctorId){
      throw new ForbiddenException('You cannot update')
    }
    const findNotes = await this.findByAppointmentId(appointmentId)
    if(!findNotes){
      throw new NotFoundException("Notes not found")
    }
    const updateNotes = await this.prisma.appointmentNotes.update({
      where:{
        id: findNotes.id
      },
      data:{
        ...updatedata
      }
    })
    return updateNotes
  }

  async findByUser(userId: number) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const find = await this.prisma.appointmentNotes.findMany({
      where: {
        appointment: {
          patientId: userId
        },
        createdAt: {
          gte: oneMonthAgo 
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include:{
        appointment:{
          include:{
            doctor:{
              include:{
                StaffDetails:{
                  include:{
                    Position:{
                      select:{
                        specialty: true
                      }
                    }
                  }
                }
              }
            },
            patient:{
              select:{
                firstName: true,
                lastName: true,
                birthDate: true
              }
            }
          }
        }
      }
    });
    return find;
  }


  // delete?
}
