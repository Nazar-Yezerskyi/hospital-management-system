import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dtos/create-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';

@Controller('position')
export class PositionController {
  constructor(
    private positionService:PositionService
  ){}

  @Get("positionName/:name")
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async findByName(@Param("name") name: string){
    const find = await this.positionService.findByName(name)
    return find
  }

  @Post()
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async addPosition(@Body() data: CreatePositionDto){
    const addPosition = await this.positionService.addPosition(data)
    return addPosition
  }

  @Put("/:id")
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async updatePosition(@Param("id") id: string, @Body() data: UpdatePositionDto){
    const updatePosition = await this.positionService.updatePosition(data,+id)
    return updatePosition
  }

  @Delete("/:id")
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async deletePosition(@Param("id") id: string){
    const deletePosition = await this.positionService.deletePosition(+id)
    return deletePosition
  }
  @Get("all")
  async showAllDoctorSpeialty(){
    const show = await this.positionService.showAllDoctorSpeialty()
    return show
  }
  
  @Get('/position')
  async showSpecialty(){
    const show = await this.positionService.showSpecialty()
    return show
  }
    @Get(":id")
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async findById(@Param(":id") id:string){
    const find = await this.positionService.findById(+id)
    return find
  }
}
