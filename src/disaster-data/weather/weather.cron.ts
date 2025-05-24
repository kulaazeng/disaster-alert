import { Injectable } from '@nestjs/common';
import { RegionsService } from 'src/regions/regions.service';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class WeatherCron {
  constructor(
    private regionService: RegionsService,
    @InjectQueue('weatherQueue') private weatherQueue: Queue,
  ) { }

  @Cron('0 */1 * * * *')   //ถ้ามี 50 region จะ cron ได้สูสุดประมาณ ทุก 3 นาที
  async handleWeatherFetch() {
    console.log('--------------------------------');
    console.log('Weather cron job started');
    console.log('--------------------------------');

    const regions = await this.regionService.findAll();

    for (const region of regions) {
      this.weatherQueue.add(
        { lat: region.latitude, lon: region.longitude },
        {
          removeOnComplete: true,
          delay: 2800, // 2.8 seconds จริงแล้วได้ 1,000,000 calls/month หรือเท่ากับ 22 calls/minute
        },
      );
    }
  }
}
