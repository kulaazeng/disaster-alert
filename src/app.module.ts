import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigAsync } from './common/configs/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(DatabaseConfigAsync),
    RegionsModule,
  ],
})
export class AppModule {}
