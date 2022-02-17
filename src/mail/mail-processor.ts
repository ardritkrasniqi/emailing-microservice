import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from "src/constants/mail-constants";

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
    private readonly logger = new Logger(MailProcessor.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }



    @Process(CONFIRM_REGISTRATION) // the executional process
    public async confirmRegistration(
        job: Job<{ email: string, confirm_url: string }>
    ) {
        this.logger.log(`Sending confirmation email to : '${job.data.email}'`);

        try{
            return this.mailerService.sendMail({
                to: job.data.email,
                from: this.configService.get("EMAIL_ADDRESS"),
                subject: "Registration",
                template: "./registration", 
                context: { confirm_url: job.data.confirm_url} // pass variables that are used on template
            });
        } catch {
            this.logger.error(`Error while sending confirmation email to: '${job.data.email}'`)
        }
    }

    // logs a completed queue
    @OnQueueCompleted()
    public onComplete(job: Job) {
        this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
    }

    // logs a failed queue
    @OnQueueFailed()
    public onError(job: Job<any>, error: any) {
        this.logger.error(
        `Failed job ${job.id} of type ${job.name}: ${error.message}`,
        error.stack,
        );
    }
}