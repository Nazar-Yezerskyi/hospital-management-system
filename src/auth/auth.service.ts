import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RoleEnum } from 'src/enums/role.emun';
import { CreateAccDto } from './dtos/create-account.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { randomBytes } from 'crypto';
import { CreateAccByAdminDto } from './dtos/create-account-by-admin';
import { RoleService } from 'src/role/role.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailerService: MailerService,
    private jwt: JwtService,
    private roleService: RoleService,
    private prisma: PrismaService
  ){}

  private async hashPassword(password: string){
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    return `${salt}::${hash}`
  }
  private async generateAccessToken(id: number, email: string, roleId: number, positionName?: string, departmentId?: number){
    const accessToken = await this.jwt.signAsync(
        {
          userId: id,
          email: email,
          roleId: roleId,
          position: positionName,
          departmentId:departmentId
        },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: process.env.JWT_EXPIRATION_TIME }
    );
    return accessToken;
  }
  private async generateRefreshToken(id: number, email: string, roleId: number, positionName?: string, departmentId?: number){
    const refreshToken = await this.jwt.signAsync(
        {
            userId: id,
            email: email,
            roleId: roleId,
            positionName: positionName,
            departmentId:departmentId

        },
        { secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME },
    );
    return refreshToken
  }

  async createAccountByUser(userData: CreateAccDto){
    if(userData.password !== userData.confirmPassword){
      throw new ForbiddenException("Password and confirmPassword must be mutch");
    }
    delete userData.confirmPassword
    
    const verificationToken = crypto.randomBytes(2).toString('hex')
    const hashPassword = await this.hashPassword(userData.password)
    const data = {
      ...userData,
      password: hashPassword
    }
    const createAccount = await this.userService.createUser(data,verificationToken,RoleEnum.USER)
    return createAccount
  }

  async createAccountByAdmin(userData: CreateAccByAdminDto){
    const findRole = await this.roleService.findById(userData.roleId)
    if(!findRole){
      throw new NotFoundException('Role not found')
    }
    const generatePassword = randomBytes(10).toString('hex').slice(0, 10);
    const hashPassword = await this.hashPassword(generatePassword)
    const data = {
      ...userData,
      password: hashPassword,
      birthDate: new Date(userData.birthDate).toISOString(),
      isVerified: true
    }
    const createAccount = await this.userService.createUser(data,null,userData.roleId)

    await this.mailerService.sendMail({
      to: userData.email,
      subject: 'Your account was created by an admin',
      text: `Hello ${userData.firstName},To log in to your account, you have been given a temporary password: ${generatePassword}\n\nAfter logging in you nedd to change your password\n\nThank you!`,
    });

    return createAccount
  }

  async verifyAccount(verificationToken: string, email: string){
    const user = await this.userService.findUserByEmailAndToken(verificationToken, email)
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token.');
    }
    const verify = await this.userService.verifyUser(user.id)
    return verify
  }

  async verifyPassword(password: string, storedPassword: string){
    const [salt, storedHash] = storedPassword.split('::')
    const hash = await bcrypt.hash(password, salt)
    return storedHash === hash
  }
  

  async signIn(userData: SignInDto){
    const {login, password} = userData 
    let user;
    if(login.includes('@')){
      user = await this.userService.findUserByEmail(login)
    } else {
      user = await this.userService.findUserByPhone(login)
    }
    if(!user){
      throw new NotFoundException("User not found")
    }
    const userInfo = await this.userService.findUserById(user.id)
    const isPasswordValid = await this.verifyPassword(password,user.password)
    if(!isPasswordValid){
      throw new BadRequestException('bad password');
    }

    const accessToken = await this.generateAccessToken(userInfo.id, userInfo.email, userInfo.roleId,userInfo.StaffDetails?.Position?.position,userInfo.StaffDetails?.departmentId)

    const refreshToken = await this.generateRefreshToken(userInfo.id, userInfo.email, userInfo.roleId,userInfo.StaffDetails?.Position?.position,userInfo.StaffDetails?.departmentId)
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async resetPassword(userData: ResetPasswordDto, userId: number){
    const {password, confirmPassword} = userData

    const user = await this.userService.findUserById(userId)
    console.log(user)
    if(!user){
      console.log("dshflbajhksdvf")
      throw new NotFoundException("User not found")
    }

    if(password !== confirmPassword){
      throw new BadRequestException('Password and confirmPassword must be match');
    }
    const hashedpassword = await this.hashPassword(password)

   const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedpassword },
    });
    return updatedUser;
  }
}
