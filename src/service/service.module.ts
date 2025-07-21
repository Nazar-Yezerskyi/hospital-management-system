import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PositionModule } from 'src/position/position.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,UserModule,PositionModule,JwtModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports:[ServiceService],
})
export class ServiceModule {}
