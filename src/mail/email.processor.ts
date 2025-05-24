import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { LoggingService } from 'src/logging/logging.service';
import { Logger } from 'winston';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mailQueue')
export class MailProcessor {
  private readonly log: Logger;

  constructor(
    private readonly loggingService: LoggingService,
    private readonly mailerService: MailerService
  ) {
    this.log = this.loggingService.winstonLogger('usgsdataProcessor', 'debug');
  }

  @Process()
  async sendEmail({ data }: Job<{ email: string, subject: string, html: string, regionId: string, disasterType: string, riskLevel: string }>) {
    try {
        const { email, subject, html, regionId, disasterType, riskLevel } = data;

      const result = await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: html,
      });

      this.log.info('sendDisasterAlertEmail success', {
        email: email,
        subject: subject,
        result: result,
        regionId: regionId,
        disasterType: disasterType,
        riskLevel: riskLevel,
      });

    } catch (error) {
      this.log.error('sendDisasterAlertEmail failed', error);
    }
  }
}
