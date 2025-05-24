import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @ApiOperation({ summary: 'Test email' })
    @Post('test')
    async testEmail() {
        return this.mailService.sendDisasterAlertEmail('R1', 'earthquake', 'high');
    }
}
