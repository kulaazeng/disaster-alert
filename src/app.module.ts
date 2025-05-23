import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), RegionsModule],
})
export class AppModule { }
