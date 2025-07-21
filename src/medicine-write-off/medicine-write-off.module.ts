import { Module } from '@nestjs/common';
import { MedicineWriteOffController } from './medicine-write-off.controller';
import { MedicineWriteOffService } from './medicine-write-off.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MedicineModule } from 'src/medicine/medicine.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, MedicineModule, JwtModule],
  controllers: [MedicineWriteOffController],
  providers: [MedicineWriteOffService]
})
export class MedicineWriteOffModule {}
