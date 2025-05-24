import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from '../common/configs/mailer.config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './email.processor';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailerConfig,
      inject: [ConfigService],
    }),
  ],

  providers: [MailService, MailProcessor, LoggingService],
  exports: [MailService, MailProcessor],
  controllers: [MailController],
})
export class MailModule { }
