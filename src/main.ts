import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// import { CommandFactory } from 'nest-commander';

// async function bootstrap() {
// const app = await NestFactory.createApplicationContext(AppModule);
// await CommandFactory.run(AppModule, ['warn', 'error']);
// }
// bootstrap();
const init = async () => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(4321);
  console.log("Application started on port ", 4321);
}

init();
