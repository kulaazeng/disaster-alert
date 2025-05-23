import { Module } from '@nestjs/common';
import { AlertSettingsService } from './alert-settings.service';
import { AlertSettingsController } from './alert-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertSetting } from './entities/alert-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertSetting])],
  providers: [AlertSettingsService],
  controllers: [AlertSettingsController]
})
export class AlertSettingsModule {}
