import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
  .setTitle('Black Pearl API')
  .setDescription('E-commerce backend for products, orders, and authentication')
  .setVersion('1.0.0')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const configuration = app.get(ConfigService);
  const port = configuration.get<number>('port')??3000
  const environment = configuration.get<string>('environment');
  await app.listen(port);
  console.log(`app is listening on ${port} environment: ${environment}`);
}
bootstrap();
