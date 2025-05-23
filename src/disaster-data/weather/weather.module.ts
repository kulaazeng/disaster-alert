import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from 'src/redis/redis.module';
import { WeatherCron } from './weather.cron';
import { RegionsService } from 'src/regions/regions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from 'src/regions/entities/region.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { WeatherProcessor } from './weather.processor';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'weatherQueue',
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    RedisModule,
    TypeOrmModule.forFeature([Region]),
    ScheduleModule.forRoot(),
  ],
  providers: [WeatherProcessor, WeatherCron, RegionsService],
  exports: [WeatherProcessor],
})
export class WeatherModule {}
