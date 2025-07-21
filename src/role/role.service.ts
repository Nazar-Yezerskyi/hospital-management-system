import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService){}

  async findAllRoles(){
    const findAllRoles = await this.prisma.role.findMany()
    return findAllRoles
  }

  async findById(id: number){
    const findRole = await this.prisma.role.findUnique({
      where:{
        id
      }
    })
    return findRole
  }

  async findByName(roleName: string){
    const findRole = await this.prisma.role.findFirst({
      where:{
        name:{
          equals: roleName
        }
      }
    })
    return findRole
  }

  async createRole(roleData: CreateRoleDto){
    const findRole = await this.findByName(roleData.name)
    if(findRole){
      throw new ForbiddenException(`Role with name ${findRole.name} already exists`)
    }
    const createRole = await this.prisma.role.create({
      data:{
        ...roleData
      }
    })
    return createRole 
  }

  async updateRole(roleData: UpdateRoleDto, roleId: number){
    const findRole = await this.findById(roleId)
    if(!findRole){
      throw new NotFoundException(`Role with id: ${roleId} not found`)
    }
    const updateRole = await this.prisma.role.update({
      where:{
        id: findRole.id
      },
      data:{
        ...roleData
      }
    })
    return updateRole

  }

  async deleteRole(roleId: number){
    const findRole = await this.findById(roleId)
    if(!findRole){
      throw new NotFoundException(`Role with id: ${roleId} not found`)
    }
    const deleteRole = await this.prisma.role.delete({
      where:{
        id: roleId
      }
    })
    return deleteRole
  }
}
