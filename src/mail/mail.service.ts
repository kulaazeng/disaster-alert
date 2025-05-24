import { Injectable } from '@nestjs/common';
import { render } from '@react-email/components';
import { DisasterAlertTemplate } from './templates/disaster-alert.template';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MailService {
  //fix email test alert
  private readonly email = 'kittipong.mesut@gmail.com';

  public constructor(
    @InjectQueue('mailQueue') private readonly mailQueue: Queue
  ) {}

  public async sendDisasterAlertEmail(
    regionId: string,
    disasterType: string,
    riskLevel: string,
  ) {
    const html = await render(
      DisasterAlertTemplate({ regionId, disasterType, riskLevel }),
    );

    return await this.sendMail(this.email, 'Disaster Alert', html, regionId, disasterType, riskLevel);
  }

  private async sendMail(email: string, subject: string, html: string, regionId: string, disasterType: string, riskLevel: string) {
    await this.mailQueue.add(
      { email, subject, html, regionId, disasterType, riskLevel },
      {
        removeOnComplete: true,
        delay: 1000,
      },
    );

    return true;
  }
}
