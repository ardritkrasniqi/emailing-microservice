import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailController {
    constructor(private readonly mailService: MailService){}

    // this microservice listents for cmd commands  


    @EventPattern({cmd: "send-registration-email"})
    async sendRegistrationEmail(email: string, confirmUrl: string){
        return this.mailService.sendRegistrationEmail(email, confirmUrl);
    }
}
