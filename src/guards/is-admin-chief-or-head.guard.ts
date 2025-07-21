import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { PositionEnum } from 'src/enums/position.enum';

@Injectable()
export class IsAdminChiefOrHeadGuard implements CanActivate {
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

      const allowedPositions = [
        PositionEnum.ADMIN,
        PositionEnum.CHIEF_MEDICAL_OFFICER,
        PositionEnum.HEAD_OF_DEPARTMENT,
      ];

      if (!allowedPositions.includes(payload.position as PositionEnum)) {
        throw new UnauthorizedException(
          'Access denied: Only management or department head can access this resource',
        );
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
