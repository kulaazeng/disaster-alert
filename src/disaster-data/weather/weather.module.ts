import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from 'src/redis/redis.module';
import { WeatherCron } from './weather.cron';
import { RegionsService } from 'src/regions/regions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from 'src/regions/entities/region.entity';
import { BullModule } from '@nestjs/bull';
import { WeatherProcessor } from './weather.processor';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'weatherQueue',
    }),
    HttpModule,
    RedisModule,
    TypeOrmModule.forFeature([Region]),
  ],
  providers: [WeatherProcessor, WeatherCron, RegionsService, LoggingService],
})
export class WeatherModule {}
