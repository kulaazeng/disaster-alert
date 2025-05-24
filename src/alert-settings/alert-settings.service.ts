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
  ) {}

  async createAlertSetting(
    alertSetting: CreateAlertSettingDto,
  ): Promise<AlertSetting> {
    const newAlertSetting = this.alertSettingRepository.create(alertSetting);
    const alertSettingData =
      await this.alertSettingRepository.save(newAlertSetting);
    await this.redisService.del('alertSettings');
    return alertSettingData;
  }

  async getAllAlertSettings(): Promise<AlertSetting[]> {
    const alertSettingsData = await this.redisService.get('alertSettings');
    if (alertSettingsData) {
      return JSON.parse(alertSettingsData) as AlertSetting[];
    }

    const alertSettings = await this.alertSettingRepository.find();
    await this.redisService.set(
      'alertSettings',
      JSON.stringify(alertSettings),
      60 * 15,
    );
    return alertSettings;
  }

  async findByRegion(regionId: string): Promise<AlertSetting[]> {
    //ดึงข้อมูล alert settings จาก redis
    const alertSettingsData = await this.redisService.get('alertSettings');
    if (alertSettingsData) {
      return JSON.parse(alertSettingsData).filter(
        (alertSetting: AlertSetting) => alertSetting.regionId === regionId,
      ) as AlertSetting[];
    }

    //ดึงข้อมูล alert settings จาก database
    const alertSettings = await this.getAllAlertSettings();

    //ค้นหา alert settings ของแต่ละ region ด้วย regionId
    const alertSettingsByRegion = alertSettings.filter(
      (alertSetting: AlertSetting) => alertSetting.regionId === regionId,
    );

    return alertSettingsByRegion;
  }
}
