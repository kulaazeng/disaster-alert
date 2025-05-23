import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-regions.dto';
import { ApiOperation } from '@nestjs/swagger';

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
}
