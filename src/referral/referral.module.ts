import { Module } from '@nestjs/common';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PositionModule } from 'src/position/position.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,UserModule,PositionModule,JwtModule],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports:[ReferralService]
})
export class ReferralModule {}
