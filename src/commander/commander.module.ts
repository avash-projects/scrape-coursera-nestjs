import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { CommanderService } from './commander.service';

@Module({
  imports: [PuppeteerModule],
  providers: [CommanderService],
})
export class CommanderModule {}
