import { Injectable, NotFoundException } from '@nestjs/common';
import { WeatherResponse } from 'src/common/interface/weather.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DisasterDataService {
  constructor(private readonly redisService: RedisService) {}

  async getWeather(lat: number, lon: number): Promise<WeatherResponse> {
    const weather = await this.redisService.get(`weather:${lat}:${lon}`);
    if (!weather) {
      throw new NotFoundException('Weather not found');
    }
    
    return JSON.parse(weather) as WeatherResponse;
  }

  async getUSGSData(): Promise<USGSData> {
    const usgsData = await this.redisService.get(`usgsdata:latest`);
    if (!usgsData) {
      throw new NotFoundException('USGS data not found');
    }
    return JSON.parse(usgsData) as USGSData;
  }
}
