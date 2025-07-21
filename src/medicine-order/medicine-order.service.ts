import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentService } from 'src/department/department.service';
import { MedicineService } from 'src/medicine/medicine.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { MedicineOrderStatus } from 'src/enums/medicine-order-status.enum';
import { PositionEnum } from 'src/enums/position.enum';

@Injectable()
export class MedicineOrderService {
  constructor(
    private prisma: PrismaService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private medicineService: MedicineService 
  ){}

  async findOrderById(id:number){
    const find = await this.prisma.medicineOrder.findUnique({
      where:{
        id
      }
    })
    return find
  }

  async createOrder(orderDetails: CreateOrderDto, userId: number) {
    const findDepartment = await this.departmentService.findById(orderDetails.departmentId);
    if (!findDepartment || findDepartment.isActive === false) {
      throw new BadRequestException("Department not found or inactive");
    }
  
    const findUser = await this.userService.findUserById(userId);
    if (!findUser.StaffDetails) {
      throw new ForbiddenException("User is not a staff");
    }
  
    if (findUser.StaffDetails.departmentId !== findDepartment.id) {
      throw new ForbiddenException('User is not allowed to create an order for a different department');
    }
  
    const findMedicine = await this.medicineService.findById(orderDetails.medicineId);
    if (!findMedicine) {
      throw new NotFoundException('Medicine not found');
    }

    const currentUpdatedAt = findMedicine.updatedAt;
  
    if (findMedicine.quantity < orderDetails.quantity) {
      throw new BadRequestException('Not enough medicine stock available');
    }
  
    const latestMedicine = await this.medicineService.findById(orderDetails.medicineId)
  
    if (latestMedicine?.updatedAt.toISOString() !== currentUpdatedAt.toISOString()) {
      throw new ConflictException('Medicine stock has been updated by another user');
    }
  
    const newQuantity = findMedicine.quantity - orderDetails.quantity;
  
    const order = await this.prisma.medicineOrder.create({
      data: {
        ...orderDetails,
      },
    });
  
    await this.medicineService.updateMedicine({ quantity: newQuantity }, orderDetails.medicineId);
  
    return order;
  }
  

  async changeQuantity(orderDetails: UpdateOrderDto, userId: number, recordId: number) {
    const findRecord = await this.findOrderById(recordId);
    if (!findRecord) {
      throw new NotFoundException("Record not found");
    }
  
    const findUser = await this.userService.findUserById(userId);
    if (!findUser.StaffDetails) {
      throw new ForbiddenException("User is not a staff");
    }
    if (findRecord.departmentId !== findUser.StaffDetails.departmentId) {
      throw new ForbiddenException('User is not allowed to update an order for a different department');
    }
  
    const findMedicine = await this.medicineService.findById(findRecord.medicineId);
    if (!findMedicine) {
      throw new NotFoundException('Medicine not found');
    }
  
    const oldQuantity = findRecord.quantity;
    const newQuantity = orderDetails.quantity;
    const quantityDifference = newQuantity - oldQuantity;
  
    if (quantityDifference > 0) {
      if (findMedicine.quantity < quantityDifference) {
        throw new BadRequestException('Not enough medicine stock to increase order quantity');
      }
    }
  
    const newStock = findMedicine.quantity - quantityDifference;
  
    const currentUpdatedAt = findRecord.updatedAt;
  
    const update = await this.prisma.$transaction(async (prisma) => {
      const latestRecord = await prisma.medicineOrder.findUnique({
        where: { id: recordId },
      });
  
      if (latestRecord?.updatedAt !== currentUpdatedAt) {
        throw new ConflictException('The order has been modified by another user');
      }
  
      const updateOrder = prisma.medicineOrder.update({
        where: { id: recordId },
        data: { quantity: newQuantity }
      });
  
      const updateStock = prisma.medicine.update({
        where: { id: findMedicine.id },
        data: { quantity: newStock }
      });

      return [updateOrder, updateStock];
    });
  
    return update;
  }
  
  
  
  private async updateStatus(orderId: number, status: MedicineOrderStatus){
    
    const update = await this.prisma.medicineOrder.update({
      where:{
        id:orderId
      },
      data:{
        status
      }
    })
    return update
  }
  async updateOrderStatus(orderId: number, userId: number, status: MedicineOrderStatus){
    
    const findRecord = await this.findOrderById(orderId)
    if(!findRecord){
      throw new NotFoundException("Record not found")
    }
    const findUser = await this.userService.findUserById(userId)
    if(!findUser.StaffDetails){
      throw new ForbiddenException("User is not a staff")
    }
    if(findRecord.departmentId !== findUser.StaffDetails.departmentId || findUser.StaffDetails.Position.position !== PositionEnum.WAREHOUSE_MANAGER){
      throw new ForbiddenException('User is not allowed to update an order for a different department');
    }
    console.log("asfdslhbfhjsa")
    if(status === MedicineOrderStatus.COMPLETED){
      const update = await this.updateStatus(findRecord.id,status)
      return update
    }
    if(status === MedicineOrderStatus.CANCELED){
      const findMedicine = await this.medicineService.findById(findRecord.medicineId);
      if (!findMedicine) {
        throw new NotFoundException('Medicine not found');
      }
      const newStock = findMedicine.quantity + findRecord.quantity;
      const update = await this.prisma.$transaction([
        this.prisma.medicineOrder.update({
          where: { id: orderId },
          data: { status },  
        }),
        this.prisma.medicine.update({
          where: { id: findRecord.medicineId },
          data: { quantity: newStock }, 
        }),
      ]);
      console.log("fsadf",update)
      return update;
    }

  }

  async showAllOrderingByDepartment(departmentId: number){
    const find = await this.prisma.medicineOrder.findMany({
      where:{
        departmentId,
      },
      orderBy:{
        createdAt: "desc"
      },
      include:{
        medicine: true
      }
    })
    return find
  }

  async getReportByDepartment(departmentId: number, startDate: string, endDate: string){
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    const find = await this.prisma.medicineOrder.findMany({
      where: {
        departmentId,
        createdAt: {
          gte: start,
          lt: end 
          },
        status: 'completed'
        },
        include: {
          medicine: true
        }
    });
    return find
  }

  async getWholeActiveOrder(){
    const find = await this.prisma.medicineOrder.findMany({
      where:{
        status: 'pending'
      },
      orderBy:{
        createdAt: 'asc'
      },
      include:{
        department: {
          select:{
            name: true
          }
        },
        medicine: true
      }
    })
    return find
  }
}
