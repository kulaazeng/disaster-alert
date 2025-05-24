import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from 'src/redis/redis.module';
import { USGSDataProcessor } from './usgsdata.processor';
import { USGSDataCron } from './usgsdata.cron';
import { RegionsService } from 'src/regions/regions.service';
import { Region } from 'src/regions/entities/region.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'usgsdataQueue',
    }),
    HttpModule,
    RedisModule,
    TypeOrmModule.forFeature([Region]),
  ],
  providers: [USGSDataProcessor, USGSDataCron, RegionsService, LoggingService],
})
export class UsgsdataModule {}
