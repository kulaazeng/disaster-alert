import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-regions.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateRegionDto } from './dto/update-regions.dto';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @ApiOperation({ summary: 'สร้าง region' })
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionsService.create(createRegionDto);
  }

  @ApiOperation({ summary: 'ดึงข้อมูล region ทั้งหมด' })
  @Get()
  findAll() {
    return this.regionsService.findAll();
  }

  @ApiOperation({ summary: 'แก้ไขข้อมูล region' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionsService.update(id, updateRegionDto);
  }
}
