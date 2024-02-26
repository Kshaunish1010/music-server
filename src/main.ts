import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true }); //have to remove while in production
  // app.enableCors({
  //   origin: ['https://localhost:8080/'],
  // });
  await app.listen(process.env.PORT||3000);
}
bootstrap();
