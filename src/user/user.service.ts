import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleEnum } from 'src/enums/role.emun';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Prisma } from '@prisma/client';
import { PositionEnum } from 'src/enums/position.enum';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}

  async findUserById(id:number){
    const findUser = await this.prisma.user.findUnique({
      where:{
        id,
      },
      include: {
        Role:true,
        StaffDetails:{
          include:{
            Position: true,
            Department:{
              select:{
                id: true
              }
            }
          }
          
        }
      }
    })
     console.log(`UserService: Found user:`, findUser);
    return findUser
  }

  async findUserByPhone(phone: string){
    const findUser = await this.prisma.user.findUnique({
      where:{
        phoneNumber: phone
      }
    })
    return findUser
  }

  async findUserByEmail(email: string){
    const findUser = await this.prisma.user.findFirst({
      where:{
        email
      },
      include:{
        StaffDetails:{
          include:{
            workSchedules:{
              include:{
                sheduleSlot: true
              }
            },
            Position:true,
            Department:{
              select:{
                name: true,
                id: true
              }
            }
          }
        }
      }
    })

    return findUser
  }

  async findPatientById(id: number) {
    const findPatient = await this.prisma.user.findFirst({
      where: {
        AND: [
          { id },
          { roleId: RoleEnum.USER }
        ],
      },
    });
    return findPatient
  }

  async findPatient(lastName?: string, firstName?: string) {
    const findPatient = await this.prisma.user.findMany({
      where: {
        AND: [
          lastName ? { lastName: { contains: lastName, mode: 'insensitive' } } : {},
          firstName ? { firstName: { contains: firstName, mode: 'insensitive' } } : {},
        ],
        roleId: RoleEnum.USER,
      },
      select:{
        id: true,
        firstName:true,
        lastName: true,
        birthDate: true
      }
    });
    return findPatient
  }

  async findExistingUserByPhoneOrEmail(phoneNumber: string, email?: string | null){
    const conditions: Prisma.UserWhereInput[] = [{ phoneNumber }];

    if (email != null) { 
      conditions.push({ email });
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });

    return existingUser;
  }

  async createUser(userData: CreateUserDto,verificationToken: string,roleId:number){
    const {phoneNumber, email} = userData
    const existingUser = await this.findExistingUserByPhoneOrEmail(phoneNumber,email)
    if (existingUser) {
      if (existingUser.phoneNumber === phoneNumber) {
        throw new ForbiddenException(
          `User with phone number: ${phoneNumber} already exists`
        );
      }
      if (email != null && existingUser.email === email) {
        throw new ForbiddenException(`User with email: ${email} already exists`);
      }
    }
    const createUser = await this.prisma.user.create({
      data:{
        ...userData,
        roleId,
        verificationToken: null,
        isVerified: true,
        birthDate: new Date(userData.birthDate),
      }
    })
    return createUser
  }

  async updateUser(id: number, userData: UpdateUserDto){
    const findUser = await this.findUserById(id)
    if(!findUser){
      throw new NotFoundException('User not found')
    }
    if(userData.phoneNumber != null){
      const findUserByPhone = await this.findUserByPhone(userData.phoneNumber)
      if(findUserByPhone.id !== findUser.id) {
        throw new ForbiddenException(`Phone number already in use`)
      }
    }
    if(userData.email != null){
      const findUserByEmail = await this.findUserByEmail(userData.email)
      if(findUserByEmail.id !== findUser.id) {
        throw new ForbiddenException(`Email already in use`)
      }
    }

    const updateUser = await this.prisma.user.update({
      where:{
        id: findUser.id,
      },
      data:{
        ...userData,
        birthDate: new Date(userData.birthDate)
      }
    })
    return updateUser
  }

  async deleteUser(userId: number){
    const findUser = await this.findUserById(userId)
    if(!findUser){
      throw new NotFoundException('User not found')
    }
    const deletedUser = await this.prisma.user.update({
      where:{
        id:userId
      },
      data:{
        isActive: false
      }
    })
    return deletedUser
  }
  
  async findUserByEmailAndToken(token:string, email: string){
    const findUserByEmail = await this.findUserByEmail(email)
    if(!findUserByEmail){
      throw new ForbiddenException("User not found")
    }
    const findUser = await this.prisma.user.findFirst({
      where:{
        verificationToken: token,
        email
      }
    })
    return findUser
  }

  async verifyUser(userId: number){
    const verifyUser = await this.prisma.user.update({
      where:{
        id: userId
      },
      data:{
        isVerified: true
      }
    })
    return verifyUser
  }
async findDoctor(query?: string) {
  const find = await this.prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        {
          StaffDetails: {
            Position: {
              specialty: { contains: query, mode: 'insensitive' },
            },
          },
        },
      ],
    },
    select: {
      id:true,
      firstName: true,
      lastName: true,
      middleName: true,
      email: true,
      profileImg: true,
      StaffDetails: {
        select: {
          hireDate: true,
          Position: {
            select: {
              position: true,
              specialty: true,
            },
          },
          workSchedules: {
            select: {
              sheduleSlot: true,
            },
          },
        },
      },
    },
  });
  const doctorsOnly = find.filter(user => 
    user.StaffDetails?.Position?.position ===  PositionEnum.DOCTOR ||  user.StaffDetails?.Position?.position ===  PositionEnum.HEAD_OF_DEPARTMENT
  );
  if(doctorsOnly.length ===0){
    throw new BadRequestException('Sorry, no doctors were found with those details. Please try again with different criteria.')
  }
  return doctorsOnly

}
async findDoctorById(id: number) {
  const find = await this.prisma.user.findMany({
    where: {
      id
    },
    select: {
      id:true,
      firstName: true,
      lastName: true,
      middleName: true,
      email: true,
      profileImg: true,
      StaffDetails: {
        select: {
          hireDate: true,
          Position: {
            select: {
              position: true,
              specialty: true,
            },
          },
          workSchedules: {
            select: {
              sheduleSlot: true,
            },
          },
        },
      },
    },
  });
  
  return find

}
  async showWholeStaff(){
    const find = await this.prisma.user.findMany({
      where:{
        Role:{
          id: RoleEnum.STAFF
        },
        StaffDetails:{
          firedDate: null
        }
      },
      include:{
        StaffDetails:{
          include: {
            Position: true,
            Department: true
          }
        }
      }
    })
    return find
  }

  async showAllDoctors() {
  const find = await this.prisma.user.findMany({
    where: {
      Role: {
        id: RoleEnum.STAFF,
      },
      StaffDetails: {
        firedDate: null,
        Position: {
          position: {
            in: [
              PositionEnum.DOCTOR,
              PositionEnum.HEAD_OF_DEPARTMENT,
              PositionEnum.CHIEF_MEDICAL_OFFICER,
            ],
          },
        },
      },
    },
    include: {
      StaffDetails: {
        include: {
          Position: true,
          workSchedules: {
            include:{
              sheduleSlot: true
            }
          },
        },
      },
    },
  });

  return find;
}

}  
