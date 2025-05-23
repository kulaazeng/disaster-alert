import { Module } from '@nestjs/common';
import { DisasterDataService } from './disaster-data.service';
import { RedisModule } from 'src/redis/redis.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [RedisModule, WeatherModule],
  providers: [DisasterDataService],
})
export class DisasterDataModule {}
