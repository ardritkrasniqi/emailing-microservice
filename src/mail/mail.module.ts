/*
Ardrit Krasniqi 2022
*/

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from 'src/constants/mail-constants';
import { MailProcessor } from './mail-processor';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get("EMAIL_HOST"),
                    port: +configService.get("EMAIL_PORT"),
                    secure: true,
                    auth: {
                        user: configService.get("EMAIL_ADDRESS"),
                        pass: configService.get("EMAIL_PASSWORD"),
                    },
                    tls: { rejectUnauthorized: true },
                },
                defaults: { from: '"Ardrit Dev Microservice" <microservice@ardrit.dev>' }, // specify the from header on emails
                template: {
                    dir: __dirname + "/templates", // directory where the templates are located
                    adapter: new HandlebarsAdapter(),
                    options: { strict: true },
                  },
            }),
        }),
        BullModule.registerQueue({
            name: MAIL_QUEUE,
        }),
    ],
    providers: [MailProcessor, MailService],
    exports: [ MailService ],
    controllers: [ MailController ]
})
export class MailModule {}
