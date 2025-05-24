import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfigAsync } from './common/configs/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertSettingsModule } from './alert-settings/alert-settings.module';
import { DisasterRisksModule } from './disaster-risks/disaster-risks.module';
import { DisasterDataModule } from './disaster-data/disaster-data.module';
import { RedisModule } from './redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggingModule } from './logging/logging.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(DatabaseConfigAsync),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    LoggingModule,
    RedisModule,
    RegionsModule,
    AlertSettingsModule,
    DisasterRisksModule,
    DisasterDataModule,
  ],
})
export class AppModule {}
