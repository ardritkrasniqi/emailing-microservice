import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandleBarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
                    tls: { rejectUnauthorized: false },
                },
                defaults: { from: '"Ardrit Dev Microservice" <microservice@ardrit.dev>' }, // specify the from header on emails
                template: {
                    dir: __dirname + "/templates", // directory where the templates are located
                    adapter: new HandleBarsAdapter(),
                    options: { strict: true },
                  },
            })
        })
    ]
})
export class MailModule {}
