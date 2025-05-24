import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DisasterRisksService } from './disaster-risks.service';
import { RedisService } from 'src/redis/redis.service';
import { Logger } from 'winston';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class DisasterRisksCron {
  private readonly log: Logger;
  constructor(
    private readonly disasterRisksService: DisasterRisksService,
    private readonly redisService: RedisService,
    private readonly loggingService: LoggingService,
  ) {
    this.log = this.loggingService.winstonLogger('disasterRisksCron', 'debug');
  }

  @Cron('0 */3 * * * *') //ถ้ามี 50 region จะ cron ได้สูสุดประมาณ ทุก 3 นาที
  async calculateDisasterRisks() {
    this.log.info('Disaster risks cron job started');
    const disasterRisks = await this.disasterRisksService.calculateDisasterRisks();
    await this.redisService.set('disasterRisks', JSON.stringify(disasterRisks), 60 * 15);
  }
}
