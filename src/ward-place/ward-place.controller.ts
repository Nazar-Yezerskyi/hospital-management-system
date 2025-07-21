import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsAdminChiefOrHeadGuard } from 'src/guards/is-admin-chief-or-head.guard';
import { WardPlaceService } from './ward-place.service';

@Controller('ward-place')
export class WardPlaceController {
  constructor(private wardPlaceService: WardPlaceService){}  
  @Post()
  @UseGuards(IsAdminChiefOrHeadGuard)
  async createPlace(
    @Query('placeNumber', ParseIntPipe) placeNumber: string,
    @Query('departmentId', ParseIntPipe) departmentId: string,
    @Query('wardNumber', ParseIntPipe) wardNumber: string,
  ) {
    return this.wardPlaceService.addWardPlace(+placeNumber, +departmentId, +wardNumber);
  }

  @Post('bulk')
  @UseGuards(IsAdminChiefOrHeadGuard)
  async createMultiplePlaces(
    @Query('startNumber') startNumber: string,
    @Query('endNumber') endNumber: string,
    @Query('departmentId') departmentId: string,
    @Query('wardNumber') wardNumber: string,
  ) {
    return this.wardPlaceService.addWardPlaces(+startNumber, +endNumber, +departmentId, +wardNumber);
  }

  @Patch('update-status')
  @UseGuards(IsAdminChiefOrHeadGuard)
  async updateIsFree(
    @Query('isFree') isFree: string,
    @Query('placeNumber') placeNumber: string,
    @Query('wardId') wardId: string,
  ) {
    return this.wardPlaceService.updateWardIsFree(isFree, +placeNumber, +wardId);
  }

  @Delete()
  @UseGuards(IsAdminChiefOrHeadGuard)
  async deletePlace(
    @Query('placeId') placeId: string,
  ) {
    return this.wardPlaceService.deletePlace(+placeId);
  }

  @Get(':wardId')
  async findFreePlacesByWard(@Param("wardId") wardId: string){
    const find = await this.wardPlaceService.findFreePlacesByWard(+wardId)
    return find
  }
}
