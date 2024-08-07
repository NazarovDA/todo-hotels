import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@abitia/zod-dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  patchNestjsSwagger();

  const config = new DocumentBuilder()
    .setTitle('todo list')
    .setDescription('API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('main');

  // console.log(process.env);
}
bootstrap();
