import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export class DatabaseConfig {
  static getConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.getOrThrow<string>('DATABASE_HOST'),
      port: configService.getOrThrow<number>('DATABASE_PORT'),
      username: configService.getOrThrow<string>('DATABASE_USER'),
      password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
      database: configService.getOrThrow<string>('DATABASE_NAME'),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    };
  }
}

export const DatabaseConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions =>
    DatabaseConfig.getConfig(configService),
  inject: [ConfigService],
};
