import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Logger } from 'winston';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class USGSDataCron {
    private readonly log: Logger;
  constructor(
    @InjectQueue('usgsdataQueue') private usgsdataQueue: Queue,
    private readonly loggingService: LoggingService,
  ) {
    this.log = this.loggingService.winstonLogger('usgsdataCron', 'debug');
  }

  @Cron('0 */3 * * * *') //ถ้ามี 50 region จะ cron ได้สูสุดประมาณ ทุก 3 นาที
  async handleUSGSDataFetch() {
    this.log.info('USGS data cron job started');
    this.usgsdataQueue.add(
      {},
      {
        removeOnComplete: true,
        delay: 2800, // 2.8 seconds จริงแล้วได้ 1,000,000 calls/month หรือเท่ากับ 22 calls/minute
      },
    );
  }
}
