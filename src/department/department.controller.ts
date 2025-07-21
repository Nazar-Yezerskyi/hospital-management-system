import { Body, Controller, Param, Post, Put, UseGuards, Get, Patch } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { AddDepartmentDto } from './dtos/add-department.dto';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';
import { UpdateDepartmentDto } from './dtos/update-department.dto';
import { IsAdminChiefOrHeadGuard } from 'src/guards/is-admin-chief-or-head.guard';

@Controller('department')
export class DepartmentController {
  constructor( private departmentService: DepartmentService){}

  @Post()
  @UseGuards(IsAdminChiefOrHeadGuard)
  async addDepartment(@Body() data: AddDepartmentDto){
    const addDepartment = await this.departmentService.addDepartment(data)
    return addDepartment
  }

  @Put('/:departmentId')
  @UseGuards(IsAdminChiefOrHeadGuard)
  async updateDepartment(@Body()data: UpdateDepartmentDto, @Param('departmentId')departmentId: string){
    const update = await this.departmentService.updateDepartment(data,+departmentId)
    return update
  }

  @Put('delete/:departmentId')
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async deleteDepartment(@Param('departmentId')departmentId: string){
    const deleteDeparment = await this.departmentService.deleteDeparment(+departmentId)
    return deleteDeparment
  }
  @Get('/whole')
  async getWholeDepartments(){
    const show = await this.departmentService.showWholeDepartments()
    return show
  }
  @Get()
  async getAllDepartments(){
    const show = await this.departmentService.showAllDepartments()
    return show
  }

  @Get('/info/:departmentId')
  async getDepartment(@Param("departmentId") departmentId: string){
    const find = await this.departmentService.getDepartmentByHeadOfDepartment(+departmentId)
    return find
  }
  @Get('stats/:departmentId')
  async getDepartmentStats(@Param("departmentId") departmentId: string){
    const get = await this.departmentService.getDepartmentStats(+departmentId)
    return get
  }

 @Patch(':id/status/:status')
  async updateDepartmentStatus(
    @Param('id') id: string,
    @Param('status') status :string
  ) {
    const updated = await this.departmentService.updateDepartmentStatus(+id, status);
    return updated;
  }
}
