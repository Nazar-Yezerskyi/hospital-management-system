import { Module } from '@nestjs/common';
import { WardController } from './ward.controller';
import { WardService } from './ward.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DepartmentModule } from 'src/department/department.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, DepartmentModule,JwtModule],
  controllers: [WardController],
  providers: [WardService],
  exports:[WardService]
})
export class WardModule {}
