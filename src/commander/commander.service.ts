import { CommandRunner, Command, Option } from 'nest-commander';
import { ICommandOptions } from './dto/commander.dto';


@Command({
    name: 'scrape',
    description: 'Scrape courses',
    // arguments: '<c>',
    // argsDescription: {
    // c: 'category of courses to scrape'
    // },
})
export class CommanderService extends CommandRunner {
    async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
        if(!options.category) return console.log("argument category is required: -c | --category <category name>");
    }
    @Option({
        flags: '-c, --category [category]',
        description: 'Scrape from a category',
    })
    parseString(val: string): string {
        return val;
    } 
}
