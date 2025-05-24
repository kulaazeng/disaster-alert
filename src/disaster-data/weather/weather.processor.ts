import { WeatherResponse } from 'src/common/interface/weather.interface';
import { RedisService } from 'src/redis/redis.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from 'winston';
import { LoggingService } from 'src/logging/logging.service';

@Processor('weatherQueue')
export class WeatherProcessor {
  private readonly log: Logger;
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly loggingService: LoggingService,
  ) {
    this.log = this.loggingService.winstonLogger('weatherProcessor', 'debug');
  }

  @Process()
  async fetchWeatherData({ data }: Job<{ lat: number; lon: number }>) {
    try {
      const { lat, lon } = data;

      this.log.info(`Weather cron job started for lat: ${lat} and lon: ${lon}`);

      const response = await firstValueFrom(
        this.httpService.get<WeatherResponse>(
          `${this.configService.get<string>('OPENWEATHER_API_URL')}?lat=${lat}&lon=${lon}&appid=${this.configService.get<string>('OPENWEATHER_API_KEY')}`,
        ),
      );

      this.log.info(`Weather data fetched successfully for response`, response.data);

      await this.redisService.set(
        `weather:${lat}:${lon}`,
        JSON.stringify(response.data),
        60 * 15,
      );
    } catch (error) {
      this.log.error('Weather cron job failed', error);
    }
  }
}
