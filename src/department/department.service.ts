import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AddDepartmentDto } from './dtos/add-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    private prisma: PrismaService,
    private userService:UserService
  ){}

  async findDepartmentByName(name:string){
    const find = await this.prisma.department.findFirst({
      where:{
        name:{
          equals: name,
          mode:'insensitive'
        }
      }
    })
    return find
  }

  async findById(id:number){
    const find = await this.prisma.department.findUnique({
      where:{
        id
      }
    })
    return find
  }

  async addDepartment(data: AddDepartmentDto){
    const findDepartment = await this.findDepartmentByName(data.name)
    if(findDepartment){
      throw new BadRequestException("Department already exists")
    }

    const addDepartment = await this.prisma.department.create({
      data:{
        ...data
      }
    })
    return addDepartment
  }

  async updateDepartment(data: UpdateDepartmentDto, departmentId: number){
    const find = await this.findById(departmentId)
    if(!find){
      throw new NotFoundException("Department not found")
    } 
    const updateDepartment = await this.prisma.department.update({
      where:{
        id: departmentId
      },
      data:{
        ...data
      }
    })
    return updateDepartment
  }

  async deleteDeparment(departmentId: number){
    const find = await this.findById(departmentId)
    if(!find){
      throw new NotFoundException("Department not found")
    } 
    const deleteDeparment = await this.prisma.department.update({
      where:{
        id: find.id
      },
      data:{
        isActive: false
      }
    })
    return deleteDeparment
  }

  async showAllDepartments(){
    const show = await this.prisma.department.findMany({
      where:{
        isActive: true
      }
    })
    return show
  }

  async showWholeDepartments(){
    const show = await this.prisma.department.findMany()
    return show
  }

  async getDepartmentByHeadOfDepartment(departmentId: number){
    const find = await this.prisma.department.findFirst({
      where:{
        id: departmentId
      }
    })
    return find
  }
  async getDepartmentStats(departmentId: number) {
  const department = await this.prisma.department.findUnique({
    where: { id: departmentId },
    include: {
      Staff: true,
      Wards: {
        include: {
          WardPlaces: {
            include: {
              Hospitalization: {
                where: {
                  dischargeDate: null 
                }
              }
            }
          }
        }
      }
    }
  });

  if (!department) {
    throw new NotFoundException('Department not found');
  }

  const totalWorkers = department.Staff.length;
  const totalWards = department.Wards.length;

  let totalBeds = 0;
  let freeBeds = 0;
  let activeHospitalizations = 0;

  for (const ward of department.Wards) {
    totalBeds += ward.WardPlaces.length;
    freeBeds += ward.WardPlaces.filter(place => place.isFree).length;
    for (const place of ward.WardPlaces) {
      activeHospitalizations += place.Hospitalization.length;
    }
  }

  return {
    departmentId: department.id,
    departmentName: department.name,
    totalWorkers,
    totalWards,
    totalBeds,
    freeBeds,
    activeHospitalizations,
  };
}
async updateDepartmentStatus(departmentId: number, isActive: string) {
    const status = isActive === "true"
    const findDepartment = await this.findById(departmentId); // Припускаємо, що це findDepartment
    if (!findDepartment) {
      throw new NotFoundException('Ward not found'); // <-- тут ward
    }

    const updated = await this.prisma.department.update({ // <-- тут ward
      where: {
        id: departmentId,
      },
      data: {
        isActive: status,
      },
    });
    return updated; // <-- тут ward
  }

}
