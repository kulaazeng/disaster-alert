import { Body, Controller, Get, Post } from '@nestjs/common';
import { AlertSettingsService } from './alert-settings.service';
import { AlertSetting } from './entities/alert-setting.entity';
import { CreateAlertSettingDto } from './dto/create-alert-setting.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('alert-settings')
export class AlertSettingsController {
    constructor(private readonly alertSettingsService: AlertSettingsService) {}

    @ApiOperation({ summary: 'สร้างการตั้งค่าเตือน' })
    @Post()
    async createAlertSetting(@Body() alertSetting: CreateAlertSettingDto): Promise<AlertSetting> {
        return this.alertSettingsService.createAlertSetting(alertSetting);
    }

    @ApiOperation({ summary: 'ดึงข้อมูลการตั้งค่าเตือนทั้งหมด' })
    @Get()
    async getAllAlertSettings(): Promise<AlertSetting[]> {
        return this.alertSettingsService.getAllAlertSettings();
    }
}
