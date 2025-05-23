import { Controller, Get } from '@nestjs/common';
import { DisasterRisksService } from './disaster-risks.service';
import { ApiOperation } from '@nestjs/swagger';
import { DisasterRisksRes } from './dto/disaster-risks-res';

@Controller('disaster-risks')
export class DisasterRisksController {
  constructor(private readonly disasterRisksService: DisasterRisksService) {}

  @ApiOperation({ summary: 'ดูข้อมูลความเสี่ยงทั้งหมด' })
  @Get()
  async getAllDisasterRisks(): Promise<DisasterRisksRes[]> {
    return this.disasterRisksService.getAllDisasterRisks();
  }
}
