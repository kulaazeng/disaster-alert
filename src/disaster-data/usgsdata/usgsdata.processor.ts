import { WeatherResponse } from 'src/common/interface/weather.interface';
import { RedisService } from 'src/redis/redis.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('usgsdataQueue')
export class USGSDataProcessor {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) { }

  @Process()
  async fetchUSGSData({ }: Job<{}>) {
    try {
      // const usgsData = await this.redisService.get(`usgsdata:latest`);
      // if (usgsData) {
      //   return JSON.parse(usgsData) as USGSData;
      // }
      const response = await firstValueFrom(
        this.httpService.get<WeatherResponse>(
          `${this.configService.get<string>('USGS_API_URL')}`,
        ),
      );

      await this.redisService.set(
        `usgsdata:latest`,
        JSON.stringify(response.data),
        60 * 15,
      );
    } catch (error) {
      console.log('--------------------------------');
      console.log('USGS data cron job failed', error);
      console.log('--------------------------------');
    }
  }
}
