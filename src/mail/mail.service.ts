import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from 'src/constants/mail-constants';

@Injectable()
export class MailService {
    // create logger instanc based on service name
    private readonly logger = new Logger(MailService.name);


    // the queue is injected into constructor
    constructor(
        @InjectQueue(MAIL_QUEUE) 
        private readonly mailQueue: Queue
    ){}



    public async sendRegistrationEmail(
        email: string,
        confirmUrl:string
    ):Promise<void>{
        try{
            await this.mailQueue.add(CONFIRM_REGISTRATION, {
                email,
                confirmUrl
            });
        } catch (error) {
                this.logger.error(
                  `Error queueing registration email to user ${error}`
                );

                throw error;
        }
    }
}
