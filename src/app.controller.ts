import { Get, Controller, Render, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ScrapeDto } from './puppeteer/dto';

@Controller('/')
export class AppController {
    constructor(private appService: AppService) {}
    @Get('/')
    @Render('index')
    root() {
        return this.appService.index();
    }

    @Post('/scrape')
    @Render('scrape')
    scrape(@Body() dto: ScrapeDto) {
        return this.appService.scrape(dto);
    }
}