import { Module } from '@nestjs/common';
import { SheduleSlotController } from './shedule-slot.controller';
import { SheduleSlotService } from './shedule-slot.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [SheduleSlotController],
  providers: [SheduleSlotService],
  exports:[SheduleSlotService]
})
export class SheduleSlotModule {}
