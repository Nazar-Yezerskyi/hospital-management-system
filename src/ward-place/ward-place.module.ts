import { Module } from '@nestjs/common';
import { WardPlaceController } from './ward-place.controller';
import { WardPlaceService } from './ward-place.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WardModule } from 'src/ward/ward.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,WardModule, JwtModule],
  controllers: [WardPlaceController],
  providers: [WardPlaceService],
  exports:[WardPlaceService]
})
export class WardPlaceModule {}
