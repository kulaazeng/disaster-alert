import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class USGSDataCron {
  constructor(
    @InjectQueue('usgsdataQueue') private usgsdataQueue: Queue,
  ) {}

  @Cron('0 */1 * * * *') //ถ้ามี 50 region จะ cron ได้สูสุดประมาณ ทุก 3 นาที
  async handleUSGSDataFetch() {
    console.log('--------------------------------');
    console.log('USGS data cron job started');
    console.log('--------------------------------');
    this.usgsdataQueue.add(
      {},
      {
        removeOnComplete: true,
        delay: 2800, // 2.8 seconds จริงแล้วได้ 1,000,000 calls/month หรือเท่ากับ 22 calls/minute
      },
    );
  }
}
