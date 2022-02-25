import * as Joi from '@hapi/joi';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './mail/services/mail.service';
import { MailController } from './mail/controllers/mail.controller';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [
        ConfigModule,
        MailModule
      ],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("REDIS_HOST"),
          port: +configService.get<number>("REDIS_PORT")
        }
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        EMAIL_ADDRESS: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    MailModule,
  ],
  controllers: [AppController, MailController],
  providers: [AppService],
})
export class AppModule {}
