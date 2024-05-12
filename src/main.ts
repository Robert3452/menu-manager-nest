import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('Api Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('API MENU MANAGER NEST')
    .build();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
