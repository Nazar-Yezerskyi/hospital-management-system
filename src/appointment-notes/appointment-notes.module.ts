import { Module } from '@nestjs/common';
import { AppointmentNotesController } from './appointment-notes.controller';
import { AppointmentNotesService } from './appointment-notes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,AppointmentModule,UserModule, JwtModule],
  controllers: [AppointmentNotesController],
  providers: [AppointmentNotesService]
})
export class AppointmentNotesModule {}
