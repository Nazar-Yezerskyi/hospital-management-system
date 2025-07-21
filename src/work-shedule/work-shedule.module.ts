import { Module } from '@nestjs/common';
import { WorkSheduleController } from './work-shedule.controller';
import { WorkSheduleService } from './work-shedule.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SheduleSlotModule } from 'src/shedule-slot/shedule-slot.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, SheduleSlotModule, UserModule,JwtModule],
  controllers: [WorkSheduleController],
  providers: [WorkSheduleService],
  exports: [WorkSheduleService]
})
export class WorkSheduleModule {}
