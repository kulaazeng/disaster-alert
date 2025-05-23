import { Module } from '@nestjs/common';
import { DisasterRisksService } from './disaster-risks.service';
import { DisasterRisksController } from './disaster-risks.controller';

@Module({
  providers: [DisasterRisksService],
  controllers: [DisasterRisksController],
})
export class DisasterRisksModule {}
