import { Module } from '@nestjs/common';
import { EmployeeRequestController } from './employee-request.controller';
import { EmployeeRequestService } from './employee-request.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, UserModule, JwtModule],
  controllers: [EmployeeRequestController],
  providers: [EmployeeRequestService]
})
export class EmployeeRequestModule {}
