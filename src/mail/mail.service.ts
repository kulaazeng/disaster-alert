import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { render } from '@react-email/components';

import { DisasterAlertTemplate } from './templates/disaster-alert.template';

@Injectable()
export class MailService {
  //fix email test alert
  private readonly email = 'kittipong.mesut@gmail.com';
  public constructor(private readonly mailerService: MailerService) {}

  public async sendDisasterAlertEmail(
    regionId: string,
    disasterType: string,
    riskLevel: string,
  ) {
    const html = await render(
      DisasterAlertTemplate({ regionId, disasterType, riskLevel }),
    );

    return this.sendMail(this.email, 'Disaster Alert', html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
