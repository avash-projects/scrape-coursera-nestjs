import { Module } from '@nestjs/common';
import { CommanderService } from './commander.service';

@Module({
  providers: [CommanderService]
})
export class CommanderModule {}
