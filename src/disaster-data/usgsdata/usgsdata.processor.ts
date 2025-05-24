import { WeatherResponse } from 'src/common/interface/weather.interface';
import { RedisService } from 'src/redis/redis.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { LoggingService } from 'src/logging/logging.service';
import { Logger } from 'winston';

@Processor('usgsdataQueue')
export class USGSDataProcessor {

  private readonly log: Logger; 

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly loggingService: LoggingService,
  ) { 
    this.log = this.loggingService.winstonLogger('usgsdataProcessor', 'debug')
  }

  @Process()
  async fetchUSGSData({ }: Job<{}>) {
    this.log.info('USGS data cron job started');
    try {
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
      this.log.error('USGS data cron job failed', error);
    }
  }
}
