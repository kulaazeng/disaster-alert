import { Module } from '@nestjs/common';
import { DisasterRisksService } from './disaster-risks.service';
import { DisasterRisksController } from './disaster-risks.controller';
import { RegionsService } from 'src/regions/regions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from 'src/regions/entities/region.entity';
import { WeatherModule } from 'src/disaster-data/weather/weather.module';
import { DisasterDataService } from 'src/disaster-data/disaster-data.service';
import { AlertSettingsService } from 'src/alert-settings/alert-settings.service';
import { AlertSetting } from 'src/alert-settings/entities/alert-setting.entity';
import { DisasterRisksCron } from './disaster.risks.cron';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  imports: [TypeOrmModule.forFeature([Region, AlertSetting]), WeatherModule],
  providers: [
    DisasterRisksService,
    RegionsService,
    DisasterDataService,
    AlertSettingsService,
    DisasterRisksCron,
    LoggingService,
  ],
  controllers: [DisasterRisksController],
})
export class DisasterRisksModule {}
