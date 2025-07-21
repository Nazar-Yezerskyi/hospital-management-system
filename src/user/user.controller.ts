import { Controller, Get, Param, Query, Patch, Body, UseGuards, Request, ForbiddenException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ){}
  @Get('search-patients')
  async searchPatients(
    @Query('lastName') lastName?: string,
    @Query('firstName') firstName?: string
  ) {
    return this.userService.findPatient(lastName, firstName);
  }
  @Get('find-doctor')
  async findDoctor(@Query('query') query?: string) {
    return this.userService.findDoctor(query);
  }

  @Get('find-doctor-by-id/:id')
  // @UseGuards(JwtAuthGuard)
  async findDoctorById(@Param('id') id: string){
    return this.userService.findDoctorById(+id)
  }
  @Get('staff')
  async findStaff(){
    const find = await this.userService.showWholeStaff()
    return find
  }

    @Get('/alldoctor')
  async getAllDoctors() {
    const doctors = await this.userService.showAllDoctors();
    return doctors;
  }
  @Post()
  async createUser(
    @Body() userData: CreateUserDto,
    @Query('roleId') roleId: string,
  ) {
    if (!roleId) {
      throw new ForbiddenException('Role ID is required');
    }
    return this.userService.createUser(userData, null, +roleId);
  }
  @Patch()
  @UseGuards(JwtAuthGuard) 
  async updateUser(
    @Body() userData: UpdateUserDto,
    @Request() req
  ) {
    const userId = req.user.userId
    return this.userService.updateUser(userId, userData);
  }
}
