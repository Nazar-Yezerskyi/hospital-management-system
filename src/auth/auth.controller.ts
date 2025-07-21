import { Body, Controller, Post, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccDto } from './dtos/create-account.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { CreateAccByAdminDto } from './dtos/create-account-by-admin';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  @Post('create-by-user')
  async createAccountByUser(@Body() userData: CreateAccDto) {
    const createAcount = await this.authService.createAccountByUser(userData)
    return createAcount
  }
  @Post('signIn')
  async signIn(@Body()data: SignInDto){
    const signIn = await this.authService.signIn(data)
    return signIn
  }
  @Post('verify-email')
  async verifyAccount( @Query('token') token: string,  @Query('email') email: string) {
    return await this.authService.verifyAccount(token, email);
  }
  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(@Body() data: ResetPasswordDto,@Request() req) {
    const userId = req.user.userId
    return await this.authService.resetPassword(data,userId);
  }
  @Post('create-by-admin')
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async createAccountByAdmin(@Body() userData: CreateAccByAdminDto) {
    return await this.authService.createAccountByAdmin(userData);
  }
}
