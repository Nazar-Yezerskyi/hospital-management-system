import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService){}

  @Get()
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async findAllRoles(){
    const findAllRoles = await this.roleService.findAllRoles()
    return findAllRoles
  }

  @Get(':id')
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async findRoleById(@Param('id') id: string){
    const findRole = await this.roleService.findById(+id)
    return findRole
  }

  @Post()
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async createRole(@Body()data: CreateRoleDto){
    const createRole = await this.roleService.createRole(data)
    return createRole
  }

  @Put(':id')
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async updateRole(@Param('id') id: string, @Body()data: UpdateRoleDto ){
    const updateRole = await this.roleService.updateRole(data,+id)
    return updateRole
  }

  @Delete(':id')
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async deleteRole(@Param('id') id: string){
    const deleteRole = await this.roleService.deleteRole(+id)
    return deleteRole
  }
}
