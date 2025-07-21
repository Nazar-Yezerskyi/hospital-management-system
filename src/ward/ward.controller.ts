import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AddWardDto } from './dtos/add-ward.dto';
import { UpdateWardDto } from './dtos/update-ward.dto';
import { WardService } from './ward.service';
import { IsAdminChiefOrHeadGuard } from 'src/guards/is-admin-chief-or-head.guard';
import { UpdateWardStatusDto } from './dtos/update-ward-status.dto';

@Controller('ward')
export class WardController {
  constructor(
    private wardService: WardService
  ){}
  
  @Post()
  @UseGuards(IsAdminChiefOrHeadGuard)
  async addWard(@Body() wardData: AddWardDto) {
    return this.wardService.addWard(wardData);
  }

  @Post('range')
  @UseGuards(IsAdminChiefOrHeadGuard)
  async addWardsInRange(
    @Query('departmentId') departmentId: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.wardService.addWardsInRange(+departmentId, +start, +end);
  }

  @Get(':id')
  @UseGuards(IsAdminChiefOrHeadGuard)
  async findById(@Param('id') id: string) {
    return this.wardService.findById(+id);
  }

  @Patch(':id')
  @UseGuards(IsAdminChiefOrHeadGuard)
  async updateWard(
    @Param('id') wardId: string,
    @Body() wardData: UpdateWardDto,
  ) {
    return this.wardService.updateWard(wardData, +wardId);
  }

 @Patch(':id/status') 
  async updateWardStatus(
    @Param('id') wardId: string, 
    @Body() updateWardStatusDto: UpdateWardStatusDto, 
  ) {
    return this.wardService.updateWardStatus(+wardId, updateWardStatusDto.isActive);
  }

  @Get('department/:departmentId')
  async findByDepartment(@Param('departmentId')departmentId: string){
    const find = await this.wardService.findByDepartment(+departmentId)
    return find
  }

}
