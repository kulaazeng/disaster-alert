import { WeatherResponse } from 'src/common/interface/weather.interface';
import { RedisService } from 'src/redis/redis.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Processor, Process, BullModule } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('weatherQueue')
export class WeatherProcessor {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) {}

  @Process()
  async fetchWeatherData({ data }: Job<{ lat: number; lon: number }>) {
    try {
      const { lat, lon } = data;

      const response = await firstValueFrom(
        this.httpService.get<WeatherResponse>(
          `${this.configService.get<string>('OPENWEATHER_API_URL')}?lat=${lat}&lon=${lon}&appid=${this.configService.get<string>('OPENWEATHER_API_KEY')}`,
        ),
      );

      await this.redisService.set(
        `weather:${lat}:${lon}`,
        JSON.stringify(response.data),
        60 * 15,
      );
      
    } catch (error) {
      console.log('--------------------------------');
      console.log('Weather cron job failed', error);
      console.log('--------------------------------');
    }
  }
}
