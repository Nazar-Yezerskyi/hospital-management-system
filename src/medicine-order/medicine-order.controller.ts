import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { MedicineOrderService } from './medicine-order.service';
import { IsMedicalStaffGuard } from 'src/guards/is-medical-staff.guard';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { MedicineOrderStatus } from 'src/enums/medicine-order-status.enum';
import { IsWareHouseManagerGuard } from 'src/guards/is-warehouse-manager.guard';

@Controller('medicine-order')
export class MedicineOrderController {
  constructor(private medicineOrderService: MedicineOrderService){}

  @Post()
  @UseGuards(IsMedicalStaffGuard)
  async createOrder(@Body() data: CreateOrderDto, @Request() req){
    const userId = req.user.userId
    const createOrder = await this.medicineOrderService.createOrder(data,userId)
    return createOrder
  }

  @Put(":orderId")
  @UseGuards(IsMedicalStaffGuard)
  async changeQuantity(@Body() data: UpdateOrderDto, @Param("orderId") orderId: string, @Request() req){
    const userId = req.user.userId
    const changeQuantity = await this.medicineOrderService.changeQuantity(data,userId,+orderId)
    return changeQuantity
  }

  @Put("status/:orderId")
  @UseGuards(IsWareHouseManagerGuard)
  async updateOrderStatus(@Param("orderId")orderId : string, @Request() req, @Body() data: MedicineOrderStatus){
    const userId = req.user.userId
    const update = await this.medicineOrderService.updateOrderStatus(+orderId,userId,data)
    return update
  }
  
  @Get('/allActive')
  async getWholeActiveOrder(){
    const find = await this.medicineOrderService.getWholeActiveOrder()
    return find
  }
  @Get('report/:departmentId')
  async getReportByDepartment(
    @Param('departmentId') departmentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.medicineOrderService.getReportByDepartment(+departmentId, startDate, endDate);
  }


  @Get(':departmentId')
  async showAllOrderingByDepartment(@Param("departmentId")departmentId: string){
    const show = await this.medicineOrderService.showAllOrderingByDepartment(+departmentId)
    return show
  }
}
