import { Module } from '@nestjs/common';
import { CommanderModule } from './commander/commander.module';
import { PuppeteerModule } from './puppeteer/puppeteer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [CommanderModule, PuppeteerModule],
})
export class AppModule {}
