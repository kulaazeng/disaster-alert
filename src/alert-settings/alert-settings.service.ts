import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertSetting } from './entities/alert-setting.entity';
import { CreateAlertSettingDto } from './dto/create-alert-setting.dto';

@Injectable()
export class AlertSettingsService {
  constructor(
    @InjectRepository(AlertSetting)
    private alertSettingRepository: Repository<AlertSetting>,
  ) {}

  async createAlertSetting(alertSetting: CreateAlertSettingDto): Promise<AlertSetting> {
    const newAlertSetting = this.alertSettingRepository.create(alertSetting);
    return this.alertSettingRepository.save(newAlertSetting);
  }

  async getAllAlertSettings(): Promise<AlertSetting[]> {
    return this.alertSettingRepository.find();
  }
}
