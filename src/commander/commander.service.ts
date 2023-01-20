import { CommandRunner, Command, Option } from 'nest-commander';
import { ICommandOptions } from './dto/commander.dto';
import { PuppeteerService } from 'src/puppeteer/puppeteer.service';


@Command({
    name: 'scrape',
    description: 'Scrape courses',
    // arguments: '<c>',
    // argsDescription: {
    // c: 'category of courses to scrape'
    // },
})
export class CommanderService extends CommandRunner {
    constructor(private puppeteer: PuppeteerService) {
        super();
    }

    async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
        const category = options.category || null;
        if (!category) return console.log("argument category is required: -c | --category <category name>");
        return this.puppeteer.scrapeCoursera(category);
    }
    @Option({
        flags: '-c, --category [category]',
        description: 'Scrape from a category',
    })
    parseString(val: string): string {
        return val;
    }
}
