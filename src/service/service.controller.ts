import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { IsAdminOrChiefDoctorGuard } from 'src/guards/is-admin-or-chief-doctor.guard';
import { AddServiceDto } from './dtos/add-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(private serviceService: ServiceService){}

  @Get('show')
  async showServices(){
    return await this.serviceService.showServices()
  }

  @Post()
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async addService(@Body() data: AddServiceDto){
    const addService = await this.serviceService.addService(data)
    return addService
  }

  @Put(':serviceId')
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async updateService(@Body() data:UpdateServiceDto, @Param("serviceId") serviceId: string){
    const update = await this.serviceService.updateService(data,+serviceId)
    return update
  }

  @Delete(':serviceId')
  @UseGuards(IsAdminOrChiefDoctorGuard)
  async deleteService(@Param("serviceId") serviceId: string){
    const deleteService = await this.serviceService.deleteService(+serviceId)
    return deleteService
  }
  @Get('by-specialty/:specialty')
  async getBySpecialty(@Param('specialty') specialty: string) {
    return await this.serviceService.findBySpecialty(specialty);
  }
}
