import { Module } from '@nestjs/common';
import { DisasterRisksService } from './disaster-risks.service';
import { DisasterRisksController } from './disaster-risks.controller';
import { RegionsService } from 'src/regions/regions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from 'src/regions/entities/region.entity';
import { WeatherModule } from 'src/disaster-data/weather/weather.module';
import { DisasterDataService } from 'src/disaster-data/disaster-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Region]), WeatherModule],
  providers: [DisasterRisksService, RegionsService, DisasterDataService],
  controllers: [DisasterRisksController],
})
export class DisasterRisksModule {}
