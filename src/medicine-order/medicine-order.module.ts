import { Module } from '@nestjs/common';
import { MedicineOrderController } from './medicine-order.controller';
import { MedicineOrderService } from './medicine-order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MedicineModule } from 'src/medicine/medicine.module';
import { DepartmentModule } from 'src/department/department.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, UserModule,MedicineModule,DepartmentModule,JwtModule],
  controllers: [MedicineOrderController],
  providers: [MedicineOrderService]
})
export class MedicineOrderModule {}
