import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertSetting } from './entities/alert-setting.entity';
import { CreateAlertSettingDto } from './dto/create-alert-setting.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AlertSettingsService {
  constructor(
    @InjectRepository(AlertSetting)
    private alertSettingRepository: Repository<AlertSetting>,
    private readonly redisService: RedisService,
  ) { }

  async createAlertSetting(
    alertSetting: CreateAlertSettingDto,
  ): Promise<AlertSetting> {
    const newAlertSetting = this.alertSettingRepository.create(alertSetting);
    const alertSettingData = await this.alertSettingRepository.save(newAlertSetting);
    await this.redisService.del('alertSettings');
    return alertSettingData;   
  }

  async getAllAlertSettings(): Promise<AlertSetting[]> {
    const alertSettingsData = await this.redisService.get('alertSettings');
    if (alertSettingsData) {
      return JSON.parse(alertSettingsData);
    }

    const alertSettings = await this.alertSettingRepository.find();
    await this.redisService.set('alertSettings', JSON.stringify(alertSettings), 60 * 15);
    return alertSettings;
  }

  async findByRegion(regionId: string): Promise<AlertSetting[]> {
    return this.alertSettingRepository.find({
      where: { regionId },
    });
  }
}
