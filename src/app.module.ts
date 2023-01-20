import { Module } from '@nestjs/common';
import { CommanderModule } from './commander/commander.module';
import { PuppeteerService } from './puppeteer/puppeteer.service';
import { PuppeteerModule } from './puppeteer/puppeteer.module';

@Module({
  imports: [CommanderModule, PuppeteerModule],
  providers: [PuppeteerService],
})
export class AppModule {}
