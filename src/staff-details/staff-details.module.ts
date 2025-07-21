import { Module } from '@nestjs/common';
import { StaffDetailsController } from './staff-details.controller';
import { StaffDetailsService } from './staff-details.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PositionModule } from 'src/position/position.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, UserModule, PositionModule,JwtModule],
  controllers: [StaffDetailsController],
  providers: [StaffDetailsService]
})
export class StaffDetailsModule {}
