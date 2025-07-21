import { forwardRef, Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkSheduleModule } from 'src/work-shedule/work-shedule.module';
import { ReferralModule } from 'src/referral/referral.module';
import { ServiceModule } from 'src/service/service.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports:[PrismaModule,UserModule, WorkSheduleModule, ReferralModule, ServiceModule,JwtModule, forwardRef(() => PaymentModule)],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports:[AppointmentService]
})
export class AppointmentModule {}
