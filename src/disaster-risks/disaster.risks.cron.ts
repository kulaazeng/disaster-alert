import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DisasterRisksService } from './disaster-risks.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DisasterRisksCron {
  constructor(
    private readonly disasterRisksService: DisasterRisksService,
    private readonly redisService: RedisService,
  ) {}

  @Cron('0 */3 * * * *') //ถ้ามี 50 region จะ cron ได้สูสุดประมาณ ทุก 3 นาที
  async calculateDisasterRisks() {
    console.log('--------------------------------');
    console.log('Disaster risks cron job started');
    console.log('--------------------------------');
    const disasterRisks = await this.disasterRisksService.calculateDisasterRisks();
    await this.redisService.set('disasterRisks', JSON.stringify(disasterRisks), 60 * 15);
    console.log('--------------------------------');
    console.log('Disaster risks cron job finished');
    console.log('--------------------------------');
  }
}
