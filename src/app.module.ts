import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PositionModule } from './position/position.module';
import { StaffDetailsModule } from './staff-details/staff-details.module';
import { SheduleSlotModule } from './shedule-slot/shedule-slot.module';
import { WorkSheduleModule } from './work-shedule/work-shedule.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AppointmentNotesModule } from './appointment-notes/appointment-notes.module';
import { ReferralModule } from './referral/referral.module';
import { DepartmentModule } from './department/department.module';
import { WardModule } from './ward/ward.module';
import { WardPlaceModule } from './ward-place/ward-place.module';
import { HospitalizationModule } from './hospitalization/hospitalization.module';
import { MedicineModule } from './medicine/medicine.module';
import { MedicineWriteOffModule } from './medicine-write-off/medicine-write-off.module';
import { MedicineOrderModule } from './medicine-order/medicine-order.module';
import { EmployeeRequestModule } from './employee-request/employee-request.module';
import { ServiceModule } from './service/service.module';
import { PaymentModule } from './payment/payment.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
      }),
    }),
    PrismaModule, 
    RoleModule, 
    UserModule, 
    AuthModule, 
    PositionModule, 
    StaffDetailsModule, 
    SheduleSlotModule, 
    WorkSheduleModule, 
    AppointmentModule, 
    AppointmentNotesModule, 
    ReferralModule, DepartmentModule, 
    WardModule, WardPlaceModule, 
    HospitalizationModule, 
    MedicineModule, 
    MedicineWriteOffModule, 
    MedicineOrderModule, 
    EmployeeRequestModule, 
    ServiceModule, 
    PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
