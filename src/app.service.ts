import * as fs from 'fs'
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ScrapeDto } from './puppeteer/dto';
import { PuppeteerService } from './puppeteer/puppeteer.service';

@Injectable()
export class AppService {
    constructor(private puppeteerService: PuppeteerService) { }
    index() {
        const files = fs.readdirSync(join(__dirname, '..', 'public'));
        return { files };
    }
    async scrape(dto: ScrapeDto){
        await this.puppeteerService.scrapeCoursera(dto);
        return this.index();
    }
}
