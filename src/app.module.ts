import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigAsync } from './common/configs/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertSettingsModule } from './alert-settings/alert-settings.module';
import { DisasterRisksModule } from './disaster-risks/disaster-risks.module';
import { DisasterDataModule } from './disaster-data/disaster-data.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(DatabaseConfigAsync),
    RedisModule,
    RegionsModule,
    AlertSettingsModule,
    DisasterRisksModule,
    DisasterDataModule,
  ],
})
export class AppModule {}
