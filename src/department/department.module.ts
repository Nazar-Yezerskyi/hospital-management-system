import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, UserModule, JwtModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports:[DepartmentService]
})
export class DepartmentModule {}
