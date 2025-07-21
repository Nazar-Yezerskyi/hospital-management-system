import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { PositionEnum } from 'src/enums/position.enum';


@Injectable()
export class IsWareHouseManagerGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authorization.replace('Bearer ', '');

    try {
      const payload: JwtPayload = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (payload.position !== PositionEnum.WAREHOUSE_MANAGER ) {
        throw new UnauthorizedException('Access denied: Not a warehouse manager');
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
