import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {

  const microserviceOptions: any = {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 8875
    },
  };
  
  const app: INestMicroservice = await
    NestFactory.createMicroservice(
      AppModule,
      microserviceOptions
    );
    

    app.listen()
}
bootstrap();
