import { Module } from '@nestjs/common';
import { HospitalizationController } from './hospitalization.controller';
import { HospitalizationService } from './hospitalization.service';
import { WardPlaceModule } from 'src/ward-place/ward-place.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,UserModule,WardPlaceModule, JwtModule],
  controllers: [HospitalizationController],
  providers: [HospitalizationService]
})
export class HospitalizationModule {}
