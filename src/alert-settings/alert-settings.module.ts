import { Module } from '@nestjs/common';
import { AlertSettingsService } from './alert-settings.service';
import { AlertSettingsController } from './alert-settings.controller';

@Module({
  providers: [AlertSettingsService],
  controllers: [AlertSettingsController]
})
export class AlertSettingsModule {}
