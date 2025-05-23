import { Controller, Get } from '@nestjs/common';
import { DisasterRisksService } from './disaster-risks.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('disaster-risks')
export class DisasterRisksController {
  constructor(private readonly disasterRisksService: DisasterRisksService) {}

  @ApiOperation({ summary: 'ดูข้อมูลความเสี่ยงทั้งหมด' })
  @Get()
  async getAllDisasterRisks(): Promise<any[]> {
    return this.disasterRisksService.getAllDisasterRisks();
  }
}
